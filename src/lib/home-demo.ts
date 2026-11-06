// The silent demo video on the home page: the real inbox on Colliedesk staging with made-up customers
// (Northwind Outdoor), cropped to the app window and encoded by ffmpeg. Files are in public/.
// A plain <video>: the build allows no client JavaScript. Width and height keep the page still.
export const HOME_DEMO = {
  mp4: '/home-demo.mp4',
  webm: '/home-demo.webm',
  poster: '/home-demo-poster.jpg',
  width: 1280,
  height: 702,
  seconds: 64,
  label: 'Silent demo of the Colliedesk inbox: open a ticket, assign it to yourself, tag it, reply with a help center article, resolve it, then the knowledge base, the help center and the Freshdesk import screen.',
  caption: 'A ticket from inbox to resolved, then the knowledge base and the Freshdesk import. 64 seconds, no sound. The real app with made-up customers.',
} as const;
