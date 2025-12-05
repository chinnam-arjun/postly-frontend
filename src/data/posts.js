// Dummy posts for testing UI
// Structure matches your backend response exactly

const Posts = [
  {
    _id: "post001",
    author: { _id: "user001", username: "john doe" },
    title: "Exploring the Mountains",
    caption: "A refreshing trip to the mountain ranges!",
    images: [
      { url: "https://picsum.photos/seed/m1/800/1200", public_id: "mock/m1", _id: "img001a" },
      { url: "https://picsum.photos/seed/m2/800/1200", public_id: "mock/m2", _id: "img001b" },
    ],
    tags: ["travel", "nature"],
    likes: [],
    likesCount: 0,
    comments: [],
    commentsCount: 0,
    saves: [],
    savesCount: 0,
    isPublished: true,
    createdAt: "2025-01-01T10:00:00.000Z",
    updatedAt: "2025-01-01T10:00:00.000Z",
    __v: 0,
  },

  {
    _id: "post002",
    author: { _id: "user002", username: "emma watson" },
    title: "Daily Coffee Love",
    caption: "Starting the day with caffeine magic ☕",
    images: [
      { url: "https://picsum.photos/seed/c1/800/1200", public_id: "mock/c1", _id: "img002a" },
    ],
    tags: ["lifestyle", "coffee"],
    likes: [],
    likesCount: 0,
    comments: [],
    commentsCount: 0,
    saves: [],
    savesCount: 0,
    isPublished: true,
    createdAt: "2025-01-02T09:15:00.000Z",
    updatedAt: "2025-01-02T09:15:00.000Z",
    __v: 0,
  },

  {
    _id: "post003",
    author: { _id: "user003", username: "alex turner" },
    title: "City Nights",
    caption: "Bright lights and busy streets.",
    images: [
      { url: "https://picsum.photos/seed/n1/800/1200", public_id: "mock/n1", _id: "img003a" },
      { url: "https://picsum.photos/seed/n2/800/1200", public_id: "mock/n2", _id: "img003b" },
      { url: "https://picsum.photos/seed/n3/800/1200", public_id: "mock/n3", _id: "img003c" },
    ],
    tags: ["city", "night", "urban"],
    likes: [],
    likesCount: 0,
    comments: [],
    commentsCount: 0,
    saves: [],
    savesCount: 0,
    isPublished: true,
    createdAt: "2025-01-03T20:30:00.000Z",
    updatedAt: "2025-01-03T20:30:00.000Z",
    __v: 0,
  },

  {
    _id: "post004",
    author: { _id: "user004", username: "michael scott" },
    title: "Office Chronicles",
    caption: "Another day, another spreadsheet.",
    images: [
      { url: "https://picsum.photos/seed/o1/800/1200", public_id: "mock/o1", _id: "img004a" },
      { url: "https://picsum.photos/seed/o2/800/1200", public_id: "mock/o2", _id: "img004b" },
      { url: "https://picsum.photos/seed/o3/800/1200", public_id: "mock/o3", _id: "img004c" },
      { url: "https://picsum.photos/seed/o4/800/1200", public_id: "mock/o4", _id: "img004d" },
    ],
    tags: ["office", "work"],
    likes: [],
    likesCount: 0,
    comments: [],
    commentsCount: 0,
    saves: [],
    savesCount: 0,
    isPublished: true,
    createdAt: "2025-01-04T14:45:00.000Z",
    updatedAt: "2025-01-04T14:45:00.000Z",
    __v: 0,
  },

  {
    _id: "post005",
    author: { _id: "user005", username: "will smith" },
    title: "Fitness Grind",
    caption: "Pushing limits every single day 💪",
    images: [
      { url: "https://picsum.photos/seed/f1/800/1200", public_id: "mock/f1", _id: "img005a" },
      { url: "https://picsum.photos/seed/f2/800/1200", public_id: "mock/f2", _id: "img005b" },
    ],
    tags: ["fitness", "gym"],
    likes: [],
    likesCount: 0,
    comments: [],
    commentsCount: 0,
    saves: [],
    savesCount: 0,
    isPublished: true,
    createdAt: "2025-01-05T06:00:00.000Z",
    updatedAt: "2025-01-05T06:00:00.000Z",
    __v: 0,
  },
];

// generate posts 6–20

for (let i = 6; i <= 20; i++) {
  Posts.push({
    _id: `post${String(i).padStart(3, "0")}`,
    author: {
      _id: `user${String(i).padStart(3, "0")}`,
      username: `user ${i}`,
    },
    title: `Sample Post ${i}`,
    caption: `This is a dummy caption for post number ${i}.`,
    images: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      (_, idx) => ({
        url: `https://picsum.photos/seed/${i}img${idx}/800/1200`,
        public_id: `mock/${i}img${idx}`,
        _id: `img${i}${idx}`,
      })
    ),
    tags: ["tag1", "tag2"],
    likes: [],
    likesCount: 0,
    comments: [],
    commentsCount: 0,
    saves: [],
    savesCount: 0,
    isPublished: true,
    createdAt: `2025-02-${String(i).padStart(2, "0")}T08:00:00.000Z`,
    updatedAt: `2025-02-${String(i).padStart(2, "0")}T08:00:00.000Z`,
    __v: 0,
  });
}

export { Posts as posts };
