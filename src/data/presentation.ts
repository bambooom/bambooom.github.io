type Social = {
  label: string;
  link: string;
  icon: string;
};

type Presentation = {
  mail: string;
  title: string;
  name: string;
  description?: string;
  socials: Social[];
  profile?: string;
};

const presentation: Presentation = {
  mail: "zhuzi.mn#gmail.com",
  title: "Bambooom",
  name: "Blah Blah Booooom",
  // profile: "/profile.webp",
  description: "I'm an ordinary frontend developer",
  socials: [
    {
      label: "GitHub",
      icon: "github",
      link: "https://github.com/MaeWolff",
    },
    {
      label: "Mastodon",
      icon: "mastodon",
      link: "https://m.cmx.im/@zhuzi",
    },
    {
      label: "Twitter",
      icon: "twitter",
      link: "https://twitter.com/bo0omzi",
    },
    {
      label: "Instagram",
      icon: "instagram",
      link: "https://www.instagram.com/milkymono/",
    },
    {
      label: "Telegram",
      icon: "telegram",
      link: "https://t.me/bambooom",
    },
    {
      label: "Email",
      icon: "envelope-at-fill",
      link: "mailto:zhuzi.mn@gmail.com",
    },
    {
      label: "RSS",
      icon: "rss-fill",
      link: "/feed.xml",
    }
  ],
};

export default presentation;
