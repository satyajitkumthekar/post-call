// Client stories on the homepage. Each one pairs the client's Instagram carousel (their story)
// with their testimonial reel, and links to their case study on Instagram.
//
// To add a client: put their files in public/stories/<slug>/ (01.webp, 02.webp ..., reel-poster.webp)
// and add an entry below.
//
// Videos live on Bunny Stream, in the same library as the main video. To turn on a client's video,
// upload it to that library and paste its video ID into bunnyId. Until then the card shows a still
// from the video with "Video coming soon". To link a client's Instagram post, paste the post's
// address into instagramUrl. Until then the card links to the results account instead.

export const BUNNY_LIBRARY_ID = '693813';

export const RESULTS_INSTAGRAM_URL = 'https://www.instagram.com/superhumanlab.fit/';

export interface StorySlide {
  src: string;
  alt: string;
}

export interface ClientStory {
  slug: string;
  name: string;
  role?: string;
  quote: string;
  stats: { value: string; label: string }[];
  summary: string[];
  slides: StorySlide[];
  reel: {
    poster: string;
    /** Bunny Stream video ID, from the video's page in Bunny. */
    bunnyId?: string;
    /** A video file in public/stories instead of Bunny. */
    src?: string;
    length?: string;
  };
  instagramUrl?: string;
}

const media = (slug: string, file: string) => `${import.meta.env.BASE_URL}stories/${slug}/${file}`;

export const stories: ClientStory[] = [
  {
    slug: "dev",
    name: "Dev",
    role: "Software sales, Sydney",
    quote: "For years I gave in to every ‘eat, eat, have more’. It was so loud, I didn’t know I had a voice.",
    stats: [
      { value: "8 kg", label: "lighter" },
      { value: "6 months", label: "of coaching" },
    ],
    summary: [
      "Dev played Australian rules football at national level until he was 19. Then came a career in software sales in Sydney, and seven or eight years of telling himself he would be back in shape in two weeks.",
      "When we started, he knew what to eat. What he could not do was say no. We did not treat any of it as failure. Each time, we looked at what set it off, until there was space between who he is and the habit he had been following.",
    ],
    slides: [
      { src: media("dev", '01.webp'), alt: "“For years I gave in to every ‘eat, eat, have more’. It was so loud, I didn’t know I had a voice.”" },
      { src: media("dev", '02.webp'), alt: "“I was an athlete until I was 19. Nationals, the whole thing. Then for seven or eight years I forgot who that was.”" },
      { src: media("dev", '03.webp'), alt: "“The idea of saying no at the table did not exist for me.”" },
      { src: media("dev", '04.webp'), alt: "“There is who I am, and there is the bad habit I was following. Seeing that difference is very, very powerful.”" },
      { src: media("dev", '05.webp'), alt: "“Wait, what? This coach actually wants to help me? Not just: here’s a plan, why aren’t you following it?”" },
      { src: media("dev", '06.webp'), alt: "“After three months with my first trainer I looked phenomenal. The minute the sessions stopped, I knew nothing.”" },
      { src: media("dev", '07.webp'), alt: "“I would say: I didn’t go to the gym, let’s move on. You were not satisfied with that answer.”" },
    ],
    reel: { poster: media("dev", 'reel-poster.webp'), bunnyId: 'e0b06045-bf44-47ff-a62f-ba5bf1efa09b', length: "2:58" },
    instagramUrl: '',
  },
  {
    slug: "dinesh",
    name: "Dinesh",
    role: "Consultant, Mumbai",
    quote: "Fighting with myself over food, losing the battle, then feeling guilty after eating. This whole chain simply vanished.",
    stats: [
      { value: "79 → 72 kg", label: "in seventeen weeks" },
      { value: "122 days", label: "of food logged, none missed" },
    ],
    summary: [
      "Dinesh is a consultant in Mumbai. When we started he had a new job, a new city and a new home to set up, all at once.",
      "So we built a routine that bent to his days. Instead of a diet plan, we worked on awareness of calories and protein, and on following his natural hunger. What he says changed most is not his body. The fight with himself is over, and he got his mental bandwidth back.",
    ],
    slides: [
      { src: media("dinesh", '01.webp'), alt: "“Fighting with myself over food, losing the battle, then feeling guilty after eating. This whole chain simply vanished.”" },
      { src: media("dinesh", '02.webp'), alt: "“The gym was the one thing I was doing half right. Once my new job started, even that became almost impossible.”" },
      { src: media("dinesh", '03.webp'), alt: "“A reel showed me some food? I was ordering it right away, then regretting it later.”" },
      { src: media("dinesh", '04.webp'), alt: "“Will I be able to sustain a strict plan with my busy schedule?”" },
      { src: media("dinesh", '05.webp'), alt: "“Right at the start, I saw how flexibly you planned everything around my work.”" },
      { src: media("dinesh", '06.webp'), alt: "“I thought I would be tempted by food everywhere. I was not even tempted at all.”" },
      { src: media("dinesh", '07.webp'), alt: "“My whole mental bandwidth is free now. For my workouts, my work, my personal life, everything.”" },
      { src: media("dinesh", '08.webp'), alt: "“This is not a cookie cutter solution. It is very specific to me and my life.”" },
    ],
    reel: { poster: media("dinesh", 'reel-poster.webp'), bunnyId: 'df7e9f44-1004-45db-8a1e-c4c3f3aa8d4a', length: "2:49" },
    instagramUrl: '',
  },
  {
    slug: "ashutosh",
    name: "Ashutosh",
    role: "AI engineer, Hamburg",
    quote: "I was the smartest in the room, but never the fittest. That gap was bothering me a lot.",
    stats: [
      { value: "69 → 65 kg", label: "body weight" },
      { value: "3 months", label: "of coaching" },
    ],
    summary: [
      "Ashutosh is an AI engineer in Hamburg. At work he was always the one who went for the difficult things. Fitness was the one place he could never push himself, and for five years that bothered him.",
      "On our first call he told me he hated pain. Somewhere in those three months the pain stopped being something to avoid. It became the sign that something new was working.",
    ],
    slides: [
      { src: media("ashutosh", '01.webp'), alt: "“I was the smartest in the room, but never the fittest. That gap was bothering me a lot.”" },
      { src: media("ashutosh", '02.webp'), alt: "“I went for the difficult things at work. In fitness I could never challenge myself.”" },
      { src: media("ashutosh", '03.webp'), alt: "“On our first call I told my coach that I hate pain. Three months later I was asking him for more.”" },
      { src: media("ashutosh", '04.webp'), alt: "“I look at the oil going into the pan and I can already see the calorie number.”" },
      { src: media("ashutosh", '05.webp'), alt: "“Now my colleagues tell me I look fit. I am finally inching in the right direction.”" },
      { src: media("ashutosh", '06.webp'), alt: "“I have also handled marketing for coaches, so I know a sales pitch when I see one. His reels were someone genuinely sharing what he had learned.”" },
      { src: media("ashutosh", '07.webp'), alt: "“A coach is not someone who holds your hand. You walk the journey yourself. He shows you which direction to walk in.”" },
    ],
    reel: { poster: media("ashutosh", 'reel-poster.webp'), bunnyId: '798e4410-2a19-4703-90d1-1ddb020887b7', length: "2:49" },
    instagramUrl: '',
  },
  {
    slug: "aditi",
    name: "Aditi",
    quote: "Calories are pocket money now. I spend them on drinks and pizza, and I’m two sizes down.",
    stats: [
      { value: "2 sizes", label: "down in two months" },
      { value: "3 months", label: "to graduate from coaching" },
    ],
    summary: [
      "Aditi came to me frustrated with her weight, with no idea where to start. She had two fears: that she would be deprived of her favourite food, and that she would lose control after a few days and quit, like she had before.",
      "So all we did was move away from diet plans. Two months in she was two sizes down and fitting into her sister’s clothes, still having her drinks and her pizza.",
    ],
    slides: [
      { src: media("aditi", '01.webp'), alt: "“Calories are pocket money now. I spend them on drinks and pizza, and I’m two sizes down.”" },
      { src: media("aditi", '02.webp'), alt: "“Will I be deprived of my favourite food? And what if I lose control after a few days and quit, like I have before?”" },
      { src: media("aditi", '03.webp'), alt: "“I know where to spend my calories and how much to save. I have become very smart with it. I play with it.”" },
      { src: media("aditi", '04.webp'), alt: "“I used to wear XL or double XL. Now I fit into my sister’s clothes, two sizes down.”" },
    ],
    reel: { poster: media("aditi", 'reel-poster.webp'), bunnyId: '97f07c6a-ff51-4592-9df6-df35be4a57d6', length: "2:19" },
    instagramUrl: '',
  },
  {
    slug: "vishwa",
    name: "Vishwa",
    role: "Hospitality, the Maldives",
    quote: "People push me to drink. I tell them: I was where you are, and now I am here. Can you do that?",
    stats: [
      { value: "30 days", label: "without a drink or a cigarette" },
    ],
    summary: [
      "Vishwa works on a resort island in the Maldives. He was already going to the gym. He would last two or three days, fall back, and tell himself there was no point.",
      "We took it one habit at a time, and we worked on the voice in his head. In his first 30 days he did not have one drink or one cigarette. He still goes to the same parties. He stands there with a juice and watches.",
    ],
    slides: [
      { src: media("vishwa", '01.webp'), alt: "“30 days without a drink or a smoke. I’m leaner, stronger. I still go to the same parties. I stand there with a juice and feel like the hero of the scene.”" },
      { src: media("vishwa", '02.webp'), alt: "“Drink tonight, gym tomorrow, regret, repeat. I was stuck in that loop for years.”" },
      { src: media("vishwa", '03.webp'), alt: "“People push me to drink. I tell them: I was where you are, and now I am here. Can you do that?”" },
      { src: media("vishwa", '04.webp'), alt: "“I only knew you from Instagram, and you were in another country. I doubted an online coach could help me.”" },
    ],
    reel: { poster: media("vishwa", 'reel-poster.webp'), bunnyId: 'a64d7944-4b33-49a5-a5c4-7a1f91a40d77', length: "2:31" },
    instagramUrl: '',
  },
];
