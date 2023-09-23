import getStringInfo from "@/utils/StringWidth";

describe("getStringInfo", () => {
  it("should return an object with width and chars properties", () => {
    const result = getStringInfo("hello");
    expect(result).toHaveProperty("width");
    expect(result).toHaveProperty("chars");
  });

  it("should return an object with width 0 if the input is an empty string", () => {
    const result = getStringInfo("");
    expect(result.width).toBe(0);
  });

  it("should strip ANSI escape codes from the input string", () => {
    const result = getStringInfo("\u001b[31mhello\u001b[0m");
    expect(result.chars).toHaveLength(5);
  });

  it("should replace emojis with two spaces", () => {
    const result = getStringInfo("hello 😊");
    expect(result.chars).toHaveLength(8);
    expect(result.chars[6]?.char).toBe(" ");
    expect(result.chars[7]?.char).toBe(" ");
  });

  it("should calculate the correct width for single-byte characters", () => {
    const result = getStringInfo("hello");
    expect(result.width).toBe(5);
    expect(result.chars[0]?.width).toBe(1);
  });

  it("should calculate the correct width for multi-byte characters", () => {
    const result = getStringInfo("你好");
    expect(result.width).toBe(4);
    expect(result.chars[0]?.width).toBe(2);
  });

  it("should treat ambiguous characters as single-byte characters", () => {
    const result = getStringInfo("¢");
    expect(result.width).toBe(1);
    expect(result.chars[0]?.width).toBe(1);
  });
});
