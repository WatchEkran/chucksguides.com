import { spawnSync, execSync } from 'child_process'

export function runCliCommand(commandString) {
  const parts = commandString.split(' ')

  spawnSync(parts[0], parts.slice(1), { stdio: 'inherit' })
}

export function getCliCommandOutput(commandString) {
  return execSync(commandString).toString().trim()
}
