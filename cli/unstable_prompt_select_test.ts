// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "@std/assert/equals";
import { promptSelect } from "./unstable_prompt_select.ts";
import { restore, stub } from "@std/testing/mock";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

Deno.test("promptSelect() handles enter", () => {
  stub(Deno.stdin, "setRaw");

  const expectedOutput = [
    "Please select a browser:\r\n",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
  ];

  let writeIndex = 0;

  stub(
    Deno.stdout,
    "writeSync",
    (data: Uint8Array) => {
      const output = decoder.decode(data);
      assertEquals(output, expectedOutput[writeIndex]);
      writeIndex++;
      return data.length;
    },
  );

  let readIndex = 0;

  const inputs = [
    "\r",
  ];

  stub(
    Deno.stdin,
    "readSync",
    (data: Uint8Array) => {
      const input = inputs[readIndex++];
      const bytes = encoder.encode(input);
      data.set(bytes);
      return bytes.length;
    },
  );

  const browser = promptSelect("Please select a browser:", [
    "safari",
    "chrome",
    "firefox",
  ]);

  assertEquals(browser, "safari");
  restore();
});

Deno.test("promptSelect() handles arrow down", () => {
  stub(Deno.stdin, "setRaw");

  const expectedOutput = [
    "Please select a browser:\r\n",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "  safari\r\n",
    "❯ chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "  safari\r\n",
    "  chrome\r\n",
    "❯ firefox\r\n",
  ];

  let writeIndex = 0;

  stub(
    Deno.stdout,
    "writeSync",
    (data: Uint8Array) => {
      const output = decoder.decode(data);
      assertEquals(output, expectedOutput[writeIndex]);
      writeIndex++;
      return data.length;
    },
  );

  let readIndex = 0;

  const inputs = [
    "\u001B[B",
    "\u001B[B",
    "\r",
  ];

  stub(
    Deno.stdin,
    "readSync",
    (data: Uint8Array) => {
      const input = inputs[readIndex++];
      const bytes = encoder.encode(input);
      data.set(bytes);
      return bytes.length;
    },
  );

  const browser = promptSelect("Please select a browser:", [
    "safari",
    "chrome",
    "firefox",
  ]);

  assertEquals(browser, "firefox");
  restore();
});

Deno.test("promptSelect() handles arrow up", () => {
  stub(Deno.stdin, "setRaw");

  const expectedOutput = [
    "Please select a browser:\r\n",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "  safari\r\n",
    "❯ chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
  ];

  let writeIndex = 0;

  stub(
    Deno.stdout,
    "writeSync",
    (data: Uint8Array) => {
      const output = decoder.decode(data);
      assertEquals(output, expectedOutput[writeIndex]);
      writeIndex++;
      return data.length;
    },
  );

  let readIndex = 0;

  const inputs = [
    "\u001B[B",
    "\u001B[A",
    "\r",
  ];

  stub(
    Deno.stdin,
    "readSync",
    (data: Uint8Array) => {
      const input = inputs[readIndex++];
      const bytes = encoder.encode(input);
      data.set(bytes);
      return bytes.length;
    },
  );

  const browser = promptSelect("Please select a browser:", [
    "safari",
    "chrome",
    "firefox",
  ]);

  assertEquals(browser, "safari");
  restore();
});

Deno.test("promptSelect() handles up index overflow", () => {
  stub(Deno.stdin, "setRaw");

  const expectedOutput = [
    "Please select a browser:\r\n",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "  safari\r\n",
    "  chrome\r\n",
    "❯ firefox\r\n",
  ];

  let writeIndex = 0;

  stub(
    Deno.stdout,
    "writeSync",
    (data: Uint8Array) => {
      const output = decoder.decode(data);
      assertEquals(output, expectedOutput[writeIndex]);
      writeIndex++;
      return data.length;
    },
  );

  let readIndex = 0;

  const inputs = [
    "\u001B[A",
    "\r",
  ];

  stub(
    Deno.stdin,
    "readSync",
    (data: Uint8Array) => {
      const input = inputs[readIndex++];
      const bytes = encoder.encode(input);
      data.set(bytes);
      return bytes.length;
    },
  );

  const browser = promptSelect("Please select a browser:", [
    "safari",
    "chrome",
    "firefox",
  ]);

  assertEquals(browser, "firefox");
  restore();
});

Deno.test("promptSelect() handles down index overflow", () => {
  stub(Deno.stdin, "setRaw");

  const expectedOutput = [
    "Please select a browser:\r\n",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "  safari\r\n",
    "❯ chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "  safari\r\n",
    "  chrome\r\n",
    "❯ firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
  ];

  let writeIndex = 0;

  stub(
    Deno.stdout,
    "writeSync",
    (data: Uint8Array) => {
      const output = decoder.decode(data);
      assertEquals(output, expectedOutput[writeIndex]);
      writeIndex++;
      return data.length;
    },
  );

  let readIndex = 0;

  const inputs = [
    "\u001B[B",
    "\u001B[B",
    "\u001B[B",
    "\r",
  ];

  stub(
    Deno.stdin,
    "readSync",
    (data: Uint8Array) => {
      const input = inputs[readIndex++];
      const bytes = encoder.encode(input);
      data.set(bytes);
      return bytes.length;
    },
  );

  const browser = promptSelect("Please select a browser:", [
    "safari",
    "chrome",
    "firefox",
  ]);

  assertEquals(browser, "safari");
  restore();
});

Deno.test("promptSelect() handles clear option", () => {
  stub(Deno.stdin, "setRaw");

  const expectedOutput = [
    "Please select a browser:\r\n",
    "❯ safari\r\n",
    "  chrome\r\n",
    "  firefox\r\n",
    "\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K\x1b[1A\r\x1b[K",
  ];

  let writeIndex = 0;

  stub(
    Deno.stdout,
    "writeSync",
    (data: Uint8Array) => {
      const output = decoder.decode(data);
      assertEquals(output, expectedOutput[writeIndex]);
      writeIndex++;
      return data.length;
    },
  );

  let readIndex = 0;

  const inputs = [
    "\r",
  ];

  stub(
    Deno.stdin,
    "readSync",
    (data: Uint8Array) => {
      const input = inputs[readIndex++];
      const bytes = encoder.encode(input);
      data.set(bytes);
      return bytes.length;
    },
  );

  const browser = promptSelect("Please select a browser:", [
    "safari",
    "chrome",
    "firefox",
  ], { clear: true });

  assertEquals(browser, "safari");
  restore();
});
