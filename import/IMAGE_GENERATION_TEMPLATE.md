# Image Generation Template for Story Illustrations

## Purpose
This template provides instructions for generating images for children's bedtime stories in the "Priče za laku noć" collection.

## Input Requirements
You will receive:
- **Story Title**: The title of the story
- **Story Body** (optional): The full story text for context
- **Author** (optional): The author name for style reference

## Image Requirements

### Technical Specifications
- **Format**: PNG or JPG
- **Size**: 1024x1024 pixels (square format)
- **Aspect Ratio**: 1:1
- **File Naming**: Use the story title, replacing spaces and special characters with underscores
  - Example: "Bijeli jelen" → `Bijeli_jelen.png`
  - Example: "Kako je tišina prošetala gradom" → `Kako_je_tisina_prosetala_gradom.png`

### Style Guidelines

1. **Art Style**:
   - Children's book illustration style
   - Soft, dreamy, and magical
   - Warm and cozy atmosphere
   - Suitable for bedtime reading
   - Gentle and peaceful aesthetic

2. **Color Palette**:
   - **Dark mode friendly**: Deep blues, purples, navy, slate
   - **Accent colors**: Warm amber, gold, soft yellows
   - **Avoid**: Harsh whites, bright neons, overly saturated colors
   - **Prefer**: Muted, soft tones that are easy on the eyes

3. **Mood & Atmosphere**:
   - Nighttime/dreamy atmosphere
   - Peaceful and calming
   - Evoke wonder and tranquility
   - Perfect for bedtime reading
   - Magical but not scary

4. **Content Guidelines**:
   - **NO TEXT**: Do not include any words, letters, or text in the image
   - **Main Character**: Feature the main character(s) from the story
   - **Key Scene**: Depict a memorable or representative scene
   - **Age Appropriate**: Suitable for children ages 5-10
   - **No Violence**: Peaceful, positive imagery only

### Prompt Structure

When creating an image generation prompt, use this structure:

```
A beautiful, magical illustration for a Croatian children's bedtime story titled "[STORY_TITLE]".

Story context: [Brief summary of the story - 2-3 sentences]

The illustration should depict: [Main scene or character description]

Style requirements:
- Children's book illustration style
- Soft, dreamy, magical atmosphere
- Warm and cozy, suitable for bedtime
- Dark mode friendly color palette (deep blues, purples, navy, slate with warm amber/gold accents)
- Gentle and peaceful, evoking wonder and tranquility
- Perfect for bedtime reading aesthetic

Technical requirements:
- No text, words, or letters in the image
- Suitable for children ages 5-10
- Peaceful and positive imagery
- 1024x1024 square format
```

### Example Prompts

#### Example 1: Simple Title Only
```
A beautiful, magical illustration for a Croatian children's bedtime story titled "Bijeli jelen".

The illustration should depict a majestic white deer in a moonlit forest clearing, surrounded by soft blue and purple tones with warm amber highlights from the moonlight.

Style: children's book illustration, soft colors, dreamy, magical, gentle and peaceful, bedtime aesthetic. Dark mode friendly color palette with deep blues, purples, navy, slate, and warm amber/gold accents. The illustration should evoke wonder, peace, and dreams, perfect for bedtime reading. No text, words, or letters in the image.
```

#### Example 2: With Story Context
```
A beautiful, magical illustration for a Croatian children's bedtime story titled "Šuma Striborova".

Story context: A story about a magical forest guardian named Stribor who helps a mother save her son from an evil snake-woman. The forest is enchanted and full of magical creatures.

The illustration should depict Stribor, an old forest guardian with a long white beard and green eyes, standing in a mystical forest clearing surrounded by forest fairies. The scene should show the magical, protective nature of the forest.

Style: children's book illustration, soft colors, dreamy, magical, gentle and peaceful, bedtime aesthetic. Dark mode friendly color palette with deep blues, purples, navy, slate, and warm amber/gold accents. The illustration should evoke wonder, peace, and dreams, perfect for bedtime reading. No text, words, or letters in the image.
```

### Character Extraction Guidelines

When story body is provided, extract:
1. **Main Character(s)**: Look for patterns like:
   - "po imenu [Name]"
   - "djevojčica po imenu [Name]"
   - "dječak po imenu [Name]"
   - "mladić po imenu [Name]"

2. **Key Scene**: Identify the most visually interesting or representative scene:
   - Opening scene
   - Climactic moment
   - Magical transformation
   - Peaceful resolution

3. **Setting**: Note the environment:
   - Forest, village, castle, sea, etc.
   - Time of day (usually evening/night for bedtime stories)
   - Weather/atmosphere

### Image Generation Tools

You can use:
- **DALL-E 3** (OpenAI): Best quality, requires API key
- **Midjourney**: High quality, requires subscription
- **Stable Diffusion**: Open source, can run locally
- **Other AI image generators**: As available

### Quality Checklist

Before finalizing an image, ensure:
- [ ] Image is 1024x1024 pixels
- [ ] No text or letters visible
- [ ] Dark mode friendly colors
- [ ] Peaceful, bedtime-appropriate mood
- [ ] Main character(s) are visible
- [ ] Style matches children's book illustration
- [ ] File name matches story title format
- [ ] Image is suitable for ages 5-10
- [ ] No scary or violent content

### File Organization

Save images to:
- **Location**: `import/` folder (for new imports)
- **Final Location**: `public/images/` (after import)
- **Naming**: Use underscore format matching story title

### Integration with Story Import

After generating an image:
1. Save it in the `import/` folder with the correct name
2. When importing the story via TSV, reference it as: `/images/[filename].png`
3. Run the `assign-import-images.ts` script to move images and update the database

## Special Cases

1. **Abstract Concepts** (e.g., "Kako je tišina prošetala gradom"):
   - Use metaphorical imagery
   - Show the effect rather than the concept itself
   - Example: A quiet, peaceful city scene at night with soft lighting

2. **Multiple Characters**:
   - Focus on the main character
   - Include others in background if relevant
   - Ensure composition is balanced

3. **Nature Stories**:
   - Emphasize the natural beauty
   - Include magical elements if appropriate
   - Show harmony between characters and nature

4. **Traditional Tales**:
   - Reference Croatian folklore elements
   - Use traditional costume/clothing if relevant
   - Maintain cultural authenticity
