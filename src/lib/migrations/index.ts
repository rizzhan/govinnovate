import type { Migration } from "../migrate";
import { migration001 } from "./001-base";
import { migration002 } from "./002-audit-log";

export const migrations: Migration[] = [migration001, migration002];
