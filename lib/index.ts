import { init } from './wasm/typegen';

export async function createFromJson(schemaName: string, data: string | object): Promise<string> {
  let json = '';
  try {
    if (typeof data === 'string') {
      json = JSON.stringify(JSON.parse(data));
    } else { 
      json = JSON.stringify(data);
    }
  } catch (error) {
    throw new Error('Invalid JSON');
  }
  const run = await init();
  return run(schemaName, json, '{output_mode: "json_schema"}');

}
