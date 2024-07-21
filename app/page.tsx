"use client"
import Image from "next/image"
import GameOfLife from "@/app/GameOfLife"

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1 className="text-xl">Conway&apos;s Game of Life</h1>
			<GameOfLife />
		</main>
	)
}
