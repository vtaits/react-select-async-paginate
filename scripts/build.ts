import { $ } from "bun";

await $`bun --filter='select-async-paginate-model' run build`;
await Promise.all([
  await $`bun --filter='select-async-paginate-fetch' run build`,
  await $`bun --filter='use-select-async-paginate' run build`,
]);
await Promise.all([
  await $`bun --filter='use-select-async-paginate-fetch' run build`,
  await $`bun --filter='react-select-async-paginate' run build`,
]);
await $`bun --filter='react-select-fetch' run build`;
