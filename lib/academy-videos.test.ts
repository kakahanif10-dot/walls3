import test from "node:test";
import assert from "node:assert/strict";
import { VIDEO_LESSONS_20, ACADEMY_MODULES } from "./academy-videos";

test("Academy has exactly 20 comprehensive video lessons", () => {
  assert.equal(VIDEO_LESSONS_20.length, 20, "Must contain exactly 20 video lessons");
});

test("All lessons have unique IDs and valid URLs", () => {
  const ids = new Set<string>();
  for (const lesson of VIDEO_LESSONS_20) {
    assert.ok(!ids.has(lesson.id), `Duplicate lesson ID: ${lesson.id}`);
    ids.add(lesson.id);
    assert.ok(lesson.title.length > 5, `Title too short for ${lesson.id}`);
    assert.ok(lesson.durationSeconds > 60, `Duration too short for ${lesson.id}`);
    assert.ok(lesson.videoUrl.startsWith("http"), `Invalid video URL for ${lesson.id}`);
    assert.ok(lesson.chapters.length >= 3, `Not enough chapters for ${lesson.id}`);
    assert.ok(lesson.takeaways.length >= 2, `Not enough takeaways for ${lesson.id}`);
    assert.ok(lesson.quiz.options.length >= 3, `Not enough quiz options for ${lesson.id}`);
    assert.ok(
      lesson.quiz.correctIndex >= 0 && lesson.quiz.correctIndex < lesson.quiz.options.length,
      `Invalid correctIndex for ${lesson.id}`
    );
  }
});

test("All modules are covered across the 20 lessons", () => {
  const covered = new Set(VIDEO_LESSONS_20.map((l) => l.module));
  for (const mod of ACADEMY_MODULES) {
    if (mod === "All Modules") continue;
    assert.ok(covered.has(mod), `Module ${mod} is missing from lessons`);
  }
});
