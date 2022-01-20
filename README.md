# linterpol

Operates on monorepo packages versioned by Git. Allows you to run multiple
NPM scripts on those packages those files have been modified with respect
to their remote versions. I would typically use it when working on multiple
NPM package simultaneously, to run linters, tests etc.

# Usage

```bash
npm install @mykulyak/linterpol
```

```bash
npx linterpol MONOREPO_ROOT_DIR [COMMAND1 [, COMMAND ...]
```

where:

- `MONOREPO_ROOT_DIR` is the directory with monorepo `package.json` is located
- `COMMAND#` are names of NPM scripts to be executed for each modified package.
  Commands will be executed sequentially in the order specified in the CLI

# Thanks

Thanks to [Piotr Kowalczyk](https://github.com/kpiotr) for suggesting the name.
