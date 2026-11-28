// Client stories on the homepage. Each one shows the client's testimonial video, their best result in
// their own words, their biggest worry before starting, and their Instagram carousel (their story).
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
  /** Their best result, in their own words. Shown big, right under the video. */
  headline: string;
  /** Their biggest worry before starting, in their own voice: the objection a prospect would raise on a call. */
  objection: string;
  /** The small label above it. Leave it out for "<Name>’s biggest worry before starting". */
  objectionLabel?: string;
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
    headline: "Food is no longer an escape. It’s liberating.",
    objection: "“I’d tried online coaches before. You get a plan, fifteen minutes a week to talk, and ‘why aren’t you following it?’ I was just one more name on a list.”",
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
    headline: "My whole mental bandwidth is free now.",
    objection: "“New job, new city, a new home to set up. Will I be able to sustain a strict plan with a schedule this busy?”",
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
    headline: "I told my coach I hate pain. Three months later I was asking him for more.",
    objection: "“I hate pain. At work I go for the difficult things, but in fitness I could never push myself.”",
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
    role: "Marketing manager, Mumbai",
    headline: "I spend my calories on drinks and pizza, and I’m two sizes down.",
    objection: "“Will I be deprived of my favourite food? And what if I lose control after a few days and quit, like I have before?”",
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
    headline: "30 days without a drink or a smoke. I still go to the same parties.",
    objection: "“I only knew you from Instagram, and you were in another country. I doubted an online coach could really help me.”",
    slides: [
      { src: media("vishwa", '01.webp'), alt: "“30 days without a drink or a smoke. I’m leaner, stronger. I still go to the same parties. I stand there with a juice and feel like the hero of the scene.”" },
      { src: media("vishwa", '02.webp'), alt: "“Drink tonight, gym tomorrow, regret, repeat. I was stuck in that loop for years.”" },
      { src: media("vishwa", '03.webp'), alt: "“People push me to drink. I tell them: I was where you are, and now I am here. Can you do that?”" },
      { src: media("vishwa", '04.webp'), alt: "“You were in another country. I doubted an online coach could help me.”" },
    ],
    reel: { poster: media("vishwa", 'reel-poster.webp'), bunnyId: 'a64d7944-4b33-49a5-a5c4-7a1f91a40d77', length: "2:31" },
    instagramUrl: '',
  },
  {
    slug: "soham",
    name: "Soham",
    role: "Chief of staff, YC startup",
    headline: "I used to be 95 kgs. Now I am 76 kgs.",
    objection: "“Some days I travel, some days I work 14 or 15 hours straight, some days it’s back-to-back meetings. How do you build a routine around that?”",
    slides: [
      { src: media("soham", '01.webp'), alt: "“Being in the fittest form of my life has helped me showcase confidence I didn’t have before.”" },
      { src: media("soham", '02.webp'), alt: "“At the end of every day, my brain used to be absolutely fried.”" },
      { src: media("soham", '03.webp'), alt: "“Satya helped me not think about fitness like an uphill task.”" },
      { src: media("soham", '04.webp'), alt: "“I used to be 95 kgs. Now I am 76 kgs. It took me eight months.”" },
    ],
    reel: { poster: media("soham", 'reel-poster.webp'), bunnyId: '773ae15d-6f1f-42c0-b459-0a22103f8a83', length: "1:58" },
    instagramUrl: '',
  },
  {
    slug: "prabhat",
    name: "Prabhat",
    role: "Product manager, Revolut",
    headline: "Everything that took mental bandwidth every day is now on autopilot.",
    objection: "“I thought this was all a scam and just couldn’t be done. I’d tried before, and every time I gave up within a few weeks.”",
    slides: [
      { src: media("prabhat", '01.webp'), alt: "“In the last month and a half, I’ve literally been on autopilot mode.”" },
      { src: media("prabhat", '02.webp'), alt: "“After a few weeks, I used to just deviate from the streak and give it all up.”" },
      { src: media("prabhat", '03.webp'), alt: "“I initially thought that this is all a scam and this just can’t be done.”" },
      { src: media("prabhat", '04.webp'), alt: "“It’s like a system that has been built. Things are just working out on their own.”" },
    ],
    reel: { poster: media("prabhat", 'reel-poster.webp'), bunnyId: '826db974-5a03-44d0-bdf7-b99586e46469', length: "1:07" },
    instagramUrl: '',
  },
  {
    slug: "ria",
    name: "Ria",
    role: "Psychologist, Melbourne",
    headline: "I can enjoy all types of food and still feel alright.",
    objection: "“Eat clean, binge, feel horrible, repeat. I felt stuck in that loop, and I thought I’d have to be a very good, clean-eating girl to see any progress.”",
    slides: [
      { src: media("ria", '01.webp'), alt: "“I can enjoy all types of food to an extent and still feel alright.”" },
      { src: media("ria", '02.webp'), alt: "“It was a very toxic relationship. I couldn’t eat a piece of cake and still feel good about myself.”" },
      { src: media("ria", '03.webp'), alt: "“Four months in, I am 5 kg lighter. But that’s the physical part of it.”" },
      { src: media("ria", '04.webp'), alt: "“Discipline is the highest form of self care. That’s what I live by.”" },
    ],
    reel: { poster: media("ria", 'reel-poster.webp'), bunnyId: '5dcdfb0b-184f-4aca-bf34-46f83145c13f', length: "1:40" },
    instagramUrl: '',
  },
  {
    slug: "ojas",
    name: "Ojas",
    role: "Consultant, BCG, Mumbai",
    headline: "I added fitness to my life without having to subtract anything.",
    objection: "“I always thought getting fit meant giving something else up. My career came first, so I expected I’d need something extremely radical.”",
    slides: [
      { src: media("ojas", '01.webp'), alt: "“I’ve been able to add fitness to my life without having to subtract anything.”" },
      { src: media("ojas", '02.webp'), alt: "“I expected I would have to do something extremely radical to see some progress.”" },
      { src: media("ojas", '03.webp'), alt: "“I always thought that if I wanted to get fit, I had to give up on something else.”" },
      { src: media("ojas", '04.webp'), alt: "“I don’t have back pain anymore. Better posture, higher energy, and I am happier in general.”" },
    ],
    reel: { poster: media("ojas", 'reel-poster.webp'), bunnyId: 'cd96073d-66b8-4367-8312-a85de1aaf1d7', length: "1:40" },
    instagramUrl: '',
  },
  {
    slug: "dhruv",
    name: "Dhruv",
    role: "AI startup, San Francisco",
    headline: "From skinny fat to that 70, 72 kilo mark. Now I’ve started cutting again.",
    objection: "“I’d been trying to gain weight my whole life. I was the skinny kid, then skinny-fat, and nothing I tried ever stuck.”",
    slides: [
      { src: media("dhruv", '01.webp'), alt: "“The best piece of advice I recently got: you can just do things.”" },
      { src: media("dhruv", '02.webp'), alt: "“I was a super skinny kid for the longest time.”" },
      { src: media("dhruv", '03.webp'), alt: "“From skinny fat to bulking, to that 70, 72 kilo mark. Now I’ve started cutting again.”" },
      { src: media("dhruv", '04.webp'), alt: "“You eat better, dress better, take care of how you look. The whole cycle is in place.”" },
    ],
    reel: { poster: media("dhruv", 'reel-poster.webp'), bunnyId: 'd3474b8b-6123-42f0-b298-a5dafb70916d', length: "1:39" },
    instagramUrl: '',
  },
  {
    slug: "sid",
    name: "Sid",
    role: "Product manager, Mumbai",
    headline: "One month in, I’ve moved weights maybe 2x more than what I was doing.",
    objection: "“I’d started before, last year and the year before. My doubt was never whether the plan works. It was: will I be able to follow it?”",
    slides: [
      { src: media("sid", '01.webp'), alt: "“Honestly, we can still see a difference, which I’m also shocked at.”" },
      { src: media("sid", '02.webp'), alt: "“The food habit was like, whatever I’m getting, I’m eating that.”" },
      { src: media("sid", '03.webp'), alt: "“I’ve seen the complexities before. Right now, everything was super easy to follow.”" },
      { src: media("sid", '04.webp'), alt: "“From my first week in the gym to now, I’ve moved weights maybe 2x more than what I was doing.”" },
    ],
    reel: { poster: media("sid", 'reel-poster.webp'), bunnyId: '7d8bbe0b-be6e-47ca-a048-d164c69a130b', length: "1:49" },
    instagramUrl: '',
  },
];
