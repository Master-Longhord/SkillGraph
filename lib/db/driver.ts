import neo4j, { Driver, Session, Integer } from 'neo4j-driver';

let driverInstance: Driver | null = null;

export function getDriver(): Driver {
  if (driverInstance) {
    return driverInstance;
  }

  const uri = process.env.COGNODB_URI;
  const username = process.env.COGNODB_USERNAME || 'cognodb';
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !password) {
    throw new Error('COGNODB_URI and COGNODB_PASSWORD environment variables must be defined.');
  }

  driverInstance = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    maxConnectionLifetime: 3 * 60 * 1000,
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 5000,
  });

  return driverInstance;
}

function sanitizeValue(val: unknown): unknown {
  if (val === null || val === undefined) {
    return val;
  }

  if (neo4j.isInt(val)) {
    return (val as Integer).toNumber();
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }

  if (typeof val === 'object') {
    const objVal = val as Record<string, unknown>;
    if (objVal.properties && typeof objVal.properties === 'object') {
      const sanitizedProps = sanitizeValue(objVal.properties) as Record<string, unknown>;
      return {
        ...sanitizedProps,
        _labels: objVal.labels || undefined,
        _type: objVal.type || undefined,
        _elementId: objVal.elementId || (objVal.identity ? String(objVal.identity) : undefined),
      };
    }

    const res: Record<string, unknown> = {};
    for (const key of Object.keys(objVal)) {
      res[key] = sanitizeValue(objVal[key]);
    }
    return res;
  }

  return val;
}

export async function runQuery<T = Record<string, unknown>>(
  cypher: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  const driver = getDriver();
  const session: Session = driver.session();

  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => {
      const obj: Record<string, unknown> = {};
      record.keys.forEach((key) => {
        const keyStr = String(key);
        const val = record.get(keyStr);
        obj[keyStr] = sanitizeValue(val);
      });
      return obj as T;
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('CognoDB Cypher Query Error:', msg);
    throw new Error(`Database query failed: ${msg}`);
  } finally {
    await session.close();
  }
}

export async function checkConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const driver = getDriver();
    await driver.verifyConnectivity();
    return { connected: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      error: msg || 'Could not establish connection to CognoDB.',
    };
  }
}

export async function closeDriver(): Promise<void> {
  if (driverInstance) {
    await driverInstance.close();
    driverInstance = null;
  }
}
