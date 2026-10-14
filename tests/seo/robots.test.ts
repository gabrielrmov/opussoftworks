import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
  it("robots inclui Disallow /painel e continua permitindo /", () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    const regra = rules.find((x) => x.userAgent === "*");
    expect(regra?.allow).toBe("/");
    expect(regra?.disallow).toBe("/painel");
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
