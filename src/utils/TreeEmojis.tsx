const treeEmojis = ["🌲", "🌳", "⛰️", "🏕️", "🪵", "☀️"]

export default function getRandomTreeEmoji() {
    return treeEmojis[Math.floor(Math.random() * treeEmojis.length)]
}
