export interface Memo {
    _id?: string; // Optional because it may not be present when creating a new deal
    name?: string;
    description?: string;

    type?: 'deal' | 'chat' | 'external' | 'blog', // Enumerated options
    targetId?: string,
    externalLink?: string,
    immediateRedirect?: Boolean,

    imagePath?: string;
    startsAt?: Date;
    endsAt?: Date;  
    createdAt?: Date;
  }