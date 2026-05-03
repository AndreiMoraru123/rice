import { execa } from 'execa';

export async function commandVersion(
  command: string,
  args: string[] = ['--version'],
): Promise<string | undefined> {
  try {
    const result = await execa(command, args, {
      timeout: 5000,
      reject: false,
    });

    const output = `${result.stdout}\n${result.stderr}`.trim();
    return output.length > 0 ? output.split('\n')[0]?.trim() : undefined;
  } catch {
    return undefined;
  }
}

export async function commandAvailable(command: string): Promise<boolean> {
  try {
    const result = await execa(command, ['--version'], {
      timeout: 3000,
      reject: false,
    });

    return result.exitCode === 0 || result.exitCode === 1;
  } catch {
    return false;
  }
}

export async function shellOutput(command: string): Promise<string | undefined> {
  const shell = process.platform === 'win32' ? 'cmd.exe' : 'sh';
  const args = process.platform === 'win32' ? ['/c', command] : ['-lc', command];

  try {
    const result = await execa(shell, args, {
      timeout: 5000,
      reject: false,
    });
    const output = `${result.stdout}\n${result.stderr}`.trim();
    return output.length > 0 ? output : undefined;
  } catch {
    return undefined;
  }
}
