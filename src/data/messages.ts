// Screenshots of messages from clients, shown at the end of the homepage. The best ones come first.
//
// To add one: put the image in public/messages/, then add an entry below at the spot where it should
// appear. Width and height are the image's size in pixels, so the wall can lay it out before it loads.
// The first eight show straight away; the rest appear when the visitor taps "Show all".
//
// Screenshots uploaded on the admin page (to "text testimonial images") still appear too, after these.
// supabaseUrl marks the ones that also live there, so they are not shown twice.

export interface ClientMessage {
  /** The image's file name in public/messages/. */
  file: string;
  width: number;
  height: number;
  /** What the message says, for people using screen readers. */
  alt: string;
  /** The same screenshot's address on the admin page, if it was uploaded there. */
  supabaseUrl?: string;
}

/** How many messages show before "Show all". */
export const MESSAGES_SHOWN_FIRST = 8;

export const messages: ClientMessage[] = [
  {
    file: "manish-sizes-down.webp",
    width: 900,
    height: 965,
    alt: "Manish: first time shopping in four months, now buying size M and S T-shirts and 32-inch jeans, down from XL and XXL.",
  },
  {
    file: "dinesh-30kg-dumbbells.webp",
    width: 900,
    height: 876,
    alt: "Dinesh: picked up 30 kg dumbbells for the first time and crushed the RDLs. “What have you made of me!!”",
  },
  {
    file: "manish-rooftop.webp",
    width: 900,
    height: 577,
    alt: "Manish: “If I had the powers, I’d scream from the rooftop for the entire world to sign up under you.”",
  },
  {
    file: "food-tracker-free.webp",
    width: 900,
    height: 1167,
    alt: "A client on blind tracking: relaxed, with a new mindset around food and no more dependence on a food tracker app.",
  },
  {
    file: "down-5kg-3-weeks.webp",
    width: 900,
    height: 935,
    alt: "A client: from 93.5 kg to 88.8 kg in three weeks, seen on a morning of being harsh on themselves.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827886473-t97aav.jpg",
  },
  {
    file: "calmer-under-triggers.webp",
    width: 900,
    height: 685,
    alt: "A client after a week of regulation: far calmer through the day, and handling triggers calmly instead of spiralling.",
  },
  {
    file: "letter-mindset-for-life.webp",
    width: 900,
    height: 1511,
    alt: "A client’s thank-you note: what changed their life was not just the plans but the coach’s calm, “mindset shift for life” approach.",
  },
  {
    file: "superpower.webp",
    width: 900,
    height: 985,
    alt: "A client: “This is your biggest superpower as a fitness coach. Not the workouts or diet, but this.”",
  },
  {
    file: "changing-so-much.webp",
    width: 900,
    height: 837,
    alt: "A client: “I feel like I am changing so much.” Saying no to late evenings, sleeping well and energetic all day.",
  },
  {
    file: "sleep-and-slow-mornings.webp",
    width: 900,
    height: 1036,
    alt: "A client: sleeping 7 hours, not rushing mornings, and sitting with uncomfortable feelings instead of escaping into food or the phone.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677432446-70ib3e.jpg",
  },
  {
    file: "avocado-toast.webp",
    width: 900,
    height: 837,
    alt: "A client: could eat avocado toast with eggs every day and not get bored. “It doesn’t feel like I’m making a sacrifice.”",
  },
  {
    file: "quit-smoking.webp",
    width: 900,
    height: 676,
    alt: "A client quit smoking cold turkey: almost two weeks without a cigarette.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677424860-94uixp.jpg",
  },
  {
    file: "manish-in-control.webp",
    width: 900,
    height: 1346,
    alt: "Manish after twelve days of Navratri: 2 kg down. “My life is in my control, my meals are in my control, my body is in my control.”",
  },
  {
    file: "travel-weddings-lowest.webp",
    width: 900,
    height: 914,
    alt: "A client hit a new lowest weight through two travel weddings, eating consciously without logging.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827904567-fvip0m.jpg",
  },
  {
    file: "fundraise-party-gym.webp",
    width: 900,
    height: 632,
    alt: "A client at the gym during an office party: “never been happier to not be drinking under pressure.”",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677412436-on1dx9.jpg",
  },
  {
    file: "outlet-for-chaos.webp",
    width: 900,
    height: 631,
    alt: "A client: after endless meetings, the daily regulation practice is an outlet for the chaos to settle.",
  },
  {
    file: "dropped-4-5kg.webp",
    width: 900,
    height: 577,
    alt: "A client: “It’s like I’ve dropped 4.5 kgs. There’s actual progress!!!”",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827929189-j2j4v8.jpg",
  },
  {
    file: "aashay-vertical-jump.webp",
    width: 900,
    height: 839,
    alt: "Aashay: hooked on seeing the body change, now playing volleyball better and jumping higher without training for it.",
  },
  {
    file: "scale-111-8.webp",
    width: 900,
    height: 1108,
    alt: "A client sees 111.8 on the scale: “These wins push you to stick to the plan more.”",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677457239-bb4o8.jpg",
  },
  {
    file: "broke-75kg.webp",
    width: 900,
    height: 404,
    alt: "A client broke a long 75 kg plateau for the first time: 74.9 kg.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677441738-u930j.jpg",
  },
  {
    file: "sudden-calm.webp",
    width: 900,
    height: 498,
    alt: "A client notices a sudden calm while getting ready: “wait, why am I feeling so calm?”",
  },
  {
    file: "no-smoking-no-alcohol.webp",
    width: 900,
    height: 350,
    alt: "A client: no smoking or alcohol since starting, focused and motivated.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677416580-r7st8i.jpg",
  },
  {
    file: "practice-before-tasks.webp",
    width: 900,
    height: 1002,
    alt: "A client did the practice before a pile of late-night tasks and got back to a focused state.",
  },
  {
    file: "feel-clean-inside.webp",
    width: 900,
    height: 603,
    alt: "A client felt clean inside and proud after saying no to a cigarette with ease.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677420760-bo437.jpg",
  },
  {
    file: "aashay-addicted-to-gym.webp",
    width: 900,
    height: 569,
    alt: "Aashay: “I have started to get addicted to the gym now.” Every workout done, Monday to Thursday.",
  },
  {
    file: "basudha-meal-guides.webp",
    width: 900,
    height: 1328,
    alt: "Basudha on the meal guides: quick and detailed versions with “good to know” tips. “It shows how invested your coach is.”",
  },
  {
    file: "22kg-dumbbells.webp",
    width: 900,
    height: 677,
    alt: "A client did dumbbell bench press with 22 kg dumbbells for 10 reps, a first.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827921625-tjzopr9.jpg",
  },
  {
    file: "down-2kg-2-weeks.webp",
    width: 900,
    height: 715,
    alt: "A client: down 2 kilos in 2 weeks.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827918537-92qbjm.jpg",
  },
  {
    file: "happier-these-days.webp",
    width: 900,
    height: 545,
    alt: "A client: “Whatever the reason is, I am happier these days.”",
  },
  {
    file: "rohit-bicep.webp",
    width: 900,
    height: 1541,
    alt: "Rohit’s bicep pop: two workouts done and many compliments from friends and family.",
  },
  {
    file: "sanjiv-white-shirt.webp",
    width: 900,
    height: 340,
    alt: "Sanjiv: afraid to wear a white shirt in August, and now it looks good.",
  },
  {
    file: "lost-taste-for-junk.webp",
    width: 900,
    height: 1169,
    alt: "A client has lost the taste for junk food and for skipping breakfast.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677451384-muu0j.PNG",
  },
  {
    file: "thanks-new-year.webp",
    width: 900,
    height: 617,
    alt: "A client: “I feel amazing having someone like you by my side.”",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827902859-wiswgi.jpg",
  },
  {
    file: "strong-week.webp",
    width: 900,
    height: 710,
    alt: "A client missed two workouts in a busy week but kept up food and steps.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827916515-6rz9n.jpg",
  },
  {
    file: "the-canvas.webp",
    width: 900,
    height: 845,
    alt: "A client feels a bit different, and it’s the progress.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827917531-aqzji.jpg",
  },
  {
    file: "down-1-5kg.webp",
    width: 900,
    height: 353,
    alt: "A client: 99.5 kg, 1.5 kg down in a week.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827914025-vbuqxk.jpg",
  },
  {
    file: "food-log.webp",
    width: 900,
    height: 1143,
    alt: "A client’s food for the day, planned and logged ahead of time.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677397754-3ghinm.jpg",
  },
  {
    file: "more-weight-or-reps.webp",
    width: 900,
    height: 695,
    alt: "A client feels better in the gym, always going for more weight or more reps.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827932333-dbhpd.jpg",
  },
  {
    file: "steps-non-negotiable.webp",
    width: 900,
    height: 1442,
    alt: "A client averaged 10,011 steps a day for a week.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1781677428337-gy1akf.jpg",
  },
  {
    file: "no-overcompensating.webp",
    width: 900,
    height: 442,
    alt: "A client planned to go extra hard on the diet to make up for the day before, just as the coach predicted.",
    supabaseUrl: "https://sruasbbxnnslydvnoyhc.supabase.co/storage/v1/object/public/text-testimonial-images/1768827896362-lq03t.jpg",
  },
];
