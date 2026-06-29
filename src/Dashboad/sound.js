import { Howl } from "howler";

export const notificationSound = new Howl({
  src: ["/sound1.mp3"],
  volume: 1.0,
  preload: true,
});