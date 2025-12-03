export const overview_query = `
  *[_type == "overview" && !(_id in path("drafts.**"))]{
    _id,
    title,
    "imageUrl": image.asset->url,
    hasVideo,
    "videoUrl": video.asset->url
  }
`;
export const corporate_query = `
  *[_type == "corporate" && !(_id in path("drafts.**")) && !defined(_system)]{
    _id,
    title,
    "imageUrl": image.asset->url,
    hasVideo,
    "videoUrl": video.asset->url
  }
`;

export const student_query = `
  *[_type == "student" && !(_id in path("drafts.**")) && !defined(_system)]{
    _id,
    title,
    "imageUrl": image.asset->url,
    hasVideo,
    "videoUrl": video.asset->url
  }
`;

export const nature_query = `
  *[_type == "nature" && !(_id in path("drafts.**")) && !defined(_system)]{
    _id,
    title,
    "imageUrl": image.asset->url,
    hasVideo,
    "videoUrl": video.asset->url
  }
`;