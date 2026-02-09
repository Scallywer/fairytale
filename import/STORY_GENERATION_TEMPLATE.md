# Story Generation Template for Claude

## Purpose
This template provides instructions for Claude (or other LLMs) to generate new bedtime stories for children in Croatian language, suitable for the "Priče za laku noć" (Bedtime Stories) collection.

## Input Requirements
You will receive either:
- **Title only**: Just the story title
- **Author only**: Just the author name (for stories in their style)
- **Title + Author**: Both title and author name

## Story Requirements

### Language
- **Language**: Croatian (hr-HR)
- **Target Audience**: Children ages 5-10
- **Purpose**: Bedtime stories to be read before sleep

### Content Guidelines

1. **Length**: 
   - Stories should be 500-1000 words
   - Reading time should be approximately 3-5 minutes
   - Use multiple paragraphs with natural breaks

2. **Style**:
   - Warm, gentle, and peaceful tone
   - Suitable for bedtime reading
   - Age-appropriate language (simple but not condescending)
   - Include dialogue to make it engaging
   - Use descriptive language to paint vivid scenes

3. **Structure**:
   - Begin with "Davno, davno..." or "U davna vremena..." or similar traditional opening
   - Introduce main character(s) early
   - Include a journey, challenge, or discovery
   - End with a positive resolution
   - Include a moral lesson (Pouka) at the end

4. **Themes** (choose appropriate ones):
   - Friendship and kindness
   - Courage and overcoming fears
   - Family bonds
   - Nature and animals
   - Magic and wonder
   - Helping others
   - Self-discovery
   - Gratitude

5. **Characters**:
   - Use Croatian names (e.g., Marko, Ana, Petar, Maja, Luka, etc.)
   - Include animals, magical creatures, or nature elements
   - Make characters relatable and positive role models

6. **Ending**:
   - Always end with a "Pouka:" section that provides a moral lesson
   - The lesson should be clear, positive, and age-appropriate
   - Format: `Pouka: [lesson text]`

### Format Requirements

When generating a story, output it in this exact format:

```
Title: [Story Title]
Author: [Author Name]
Body: [Full story text with paragraphs separated by blank lines]

[Story content here...]

Pouka: [Moral lesson]
```

### Example Structure

```
Title: Mala zvijezda i veliki san
Author: Originalna priča

Body:
Davno, davno, kad su zvijezde bile bliže zemlji, živjela je mala zvijezda po imenu Zvjezdica. Bila je najmanja zvijezda na cijelom nebu, ali imala je najveći san - željela je pomoći djeci da zaspe.

Svake noći, dok su druge zvijezde samo sjale, Zvjezdica je šapćala tihu pjesmu. Njezina pjesma bila je toliko nježna da su je čule samo najbolje djece - ona koja su spremna za san.

Jedne večeri, mali dječak po imenu Luka nije mogao zaspati. Gledao je kroz prozor i vidio Zvjezdicu kako mu treperi.

"Zvijezdo," šaptao je, "zašto ne mogu zaspati?"

Zvjezdica je spustila mali zračak svjetlosti prema Luki. "Zato što tvoj um još razmišlja o danu," rekla je nježno. "Ali ja ću ti pomoći."

I počela je pjevati svoju tihu pjesmu. Luka je zatvorio oči i slušao. Pjesma je bila poput mekog pokrivača koji ga je omotao. U roku od nekoliko trenutaka, Luka je mirno zaspao.

Od tog dana, Zvjezdica je pomagala svim djeci koja su imala problema sa spavanjem. Njezina pjesma postala je poznata kao "Pjesma dobrog sna".

A Luka? Luka je svake večeri gledao kroz prozor, tražeći svoju malu prijateljicu zvijezdu. I uvijek bi zaspao mirno, znajući da je Zvjezdica tamo gore i čuva ga.

Pouka: Najmanji prijatelji mogu imati najveće darove. I ponekad je dovoljno biti tih i nježan da pomogneš nekome.
```

## Special Instructions

1. **If only Title is provided**:
   - Create an original story that fits the title
   - Use "Originalna priča" as the author
   - Ensure the story content matches the title's theme

2. **If only Author is provided**:
   - Research the author's style (if known Croatian author)
   - Create a story in their typical style and themes
   - Use a title that fits their work
   - If author is "Ivana Brlić-Mažuranić (prepričano)", create a story in the style of Croatian fairy tales with magical elements
   - If author is "Vladimir Nazor (prepričano)", include nature themes and Croatian folklore
   - If author is "Branko Ćopić (prepričano)", include humor and everyday life elements

3. **If Title + Author is provided**:
   - Match the story to both the title and author's style
   - Ensure consistency with the author's typical themes

4. **Cultural Sensitivity**:
   - Use Croatian cultural elements appropriately
   - Include Croatian names, places, and traditions when relevant
   - Respect the bedtime story tradition

## Output Format

Always output the story in the exact TSV-compatible format:

```
Title: [Title]
Author: [Author]
Body: "[Story text with proper paragraph breaks]"
```

Note: The body should be in quotes and can span multiple lines. Use actual newlines for paragraph breaks.

## Quality Checklist

Before finalizing, ensure:
- [ ] Story is in Croatian
- [ ] Length is 500-1000 words
- [ ] Reading time is approximately 3-5 minutes
- [ ] Story has a clear beginning, middle, and end
- [ ] Includes dialogue
- [ ] Includes a "Pouka:" moral lesson
- [ ] Language is age-appropriate
- [ ] Format matches the required structure
