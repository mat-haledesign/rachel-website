import { defineLive } from "next-sanity";
import { token } from "@/sanity/lib/token"
import { client } from "@/sanity/lib/client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
});