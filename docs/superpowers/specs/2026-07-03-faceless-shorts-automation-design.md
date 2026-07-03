# Faceless Educational Shorts Automation Design

## Goal

Create a local automation workflow that helps produce 30-60 second, 9:16 educational short videos for YouTube Shorts, Instagram Reels, and TikTok with as little repeated manual work as possible.

The first version should still keep the creator in control of topic choice. The automation suggests topics, the creator approves one, and the system generates the video package from there.

## Content Style

The channel format is faceless educational content about:

- History
- Animals
- Science
- General facts

Videos should use a friendly cartoon style instead of live footage or realistic generated people. This keeps generation simpler, makes the style more repeatable, and avoids the need to film or appear on camera.

Each video should feel quick, clear, and curiosity-driven:

- Strong hook in the first 1-3 seconds
- 3-5 concise facts or story beats
- Simple closing line or call to curiosity
- Burned-in captions for silent viewing
- Upload-ready metadata for the major short-form platforms

## Recommended V1 Approach

Build a local hybrid generator.

The creator runs a command, reviews suggested topics, chooses one, and the automation creates the rest of the upload package.

This approach is better than a fully automatic batch generator for the first version because the topic is the most important quality decision. It avoids producing a pile of low-quality videos while still removing the repetitive production work: scripting, scene planning, narration, captions, rendering, and metadata.

It is also better than starting with a web dashboard because the video format should be proven first. A dashboard can be added later once the output style and pipeline are working.

The default implementation should be a Python command-line tool because the workspace already uses Python scripts and Python has practical media tooling for file generation. Rendering should use a local video stack around FFmpeg, with higher-level Python libraries used where they reduce complexity.

## User Flow

1. Creator runs a local command, for example `make-short`.
2. System suggests 5 topic ideas across history, animals, science, and facts.
3. Creator chooses a topic by number.
4. System generates a short script.
5. System generates a scene plan for reusable cartoon scenes.
6. System generates narration audio.
7. System generates timed captions.
8. System renders a 1080x1920 `.mp4` video.
9. System writes upload metadata next to the video.

The expected manual work in V1 should be limited to:

- Running the command
- Choosing or approving a topic
- Reviewing the final video before upload
- Uploading manually to each platform

## Outputs

Each generated short should produce a folder containing:

- `video.mp4`: 9:16 rendered short
- `script.txt`: final narration script
- `captions.srt`: timed captions
- `metadata.md`: title, description, hashtags, and pinned comment idea
- `scene-plan.json`: structured scene plan used for rendering
- `source-notes.md`: brief fact/source notes when available

## Architecture

The pipeline should be split into small modules so each step can be tested and replaced later.

### Topic Generator

Suggests a small list of short-form educational topics.

Inputs:

- Allowed categories
- Optional seed topic
- Desired count

Output:

- Topic ideas with category, title, hook angle, and why it may work as a short

### Script Generator

Turns the selected topic into a 30-60 second narration script.

Responsibilities:

- Keep the length short enough for the target duration
- Use simple language
- Open with a strong hook
- Avoid unsupported or exaggerated claims
- Include a compact ending

### Source And Review Notes

V1 should include lightweight review notes, not a full research engine.

For generated claims, the system should produce short notes listing the key facts that should be verified before publishing. The generated video should be treated as ready for creator review, not automatically safe to publish without review. If source APIs or browsing are added later, this module can become stricter and include source links.

### Scene Planner

Converts the script into a small set of cartoon scene instructions.

Each scene should include:

- Background type
- Character or object to show
- Caption text
- Motion cue
- Duration estimate

V1 should use reusable cartoon templates rather than brand-new AI images for every frame. This keeps rendering fast and style-consistent.

### Narration

Generates voiceover audio from the final script.

V1 should support a pluggable text-to-speech provider. The system should keep the voice choice in configuration so it can be changed without editing pipeline code.

### Caption Timing

Creates timed subtitles from the script and narration.

V1 can estimate caption timings from narration duration and sentence length if word-level alignment is not available. The generated captions should be burned into the video and also exported as `.srt`.

### Renderer

Creates the final vertical video.

Responsibilities:

- 1080x1920 resolution
- 30-60 second duration
- Cartoon visual scenes
- Basic motion and transitions
- Burned-in captions
- Background music at a low volume
- Final `.mp4` export

### Metadata Generator

Creates upload-ready text for:

- YouTube Shorts
- Instagram Reels
- TikTok

Metadata should include:

- Short title
- Description
- 8-15 hashtags
- Pinned comment idea
- Optional alternate titles

## Configuration

The workflow should use a simple config file for choices that should not be hard-coded:

- Channel name
- Preferred categories
- Default video length
- Voice provider and voice ID
- Caption style
- Cartoon theme
- Background music path
- Output directory

Secrets such as API keys must live in environment variables and must not be committed.

## Error Handling

The command should fail with clear messages when:

- Required API keys are missing
- Narration generation fails
- Rendering fails
- Output folders cannot be created
- Generated script is too long or empty

Partial outputs should be kept when useful, so the creator can inspect what failed without rerunning the entire workflow.

## Testing Strategy

V1 should include focused tests for:

- Topic selection data shape
- Script length checks
- Scene plan schema
- Caption timing output
- Metadata generation
- Renderer smoke test with a tiny sample script

The full video render can be slower, so it should be available as a smoke test rather than required for every fast test run.

## V1 Scope

Included:

- Local command-line workflow
- Hybrid topic approval
- Educational script generation
- Template-based cartoon scene planning
- Voiceover generation through a configurable provider
- Captions
- 9:16 `.mp4` render
- Upload-ready metadata files
- Manual creator review before publishing

Not included in V1:

- Automatic upload to YouTube, Instagram, or TikTok
- Full browser dashboard
- Fully automatic batch publishing
- Advanced research and citation verification
- Custom AI image generation for every scene
- Analytics-based topic optimization

## Later Improvements

After V1 works, the next useful improvements are:

- Batch mode with approval queue
- Simple browser dashboard
- Source-backed fact checking
- Auto-generated thumbnails or cover frames
- Platform-specific upload helpers
- Reusable character packs
- Performance tracking from published videos
