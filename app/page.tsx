import Image from "next/image"
import GameOfLife from "@/app/GameOfLife"

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="App">
				<h1>Conway's Game of Life</h1>
				<GameOfLife />
			</div>
		</main>
	)
}
