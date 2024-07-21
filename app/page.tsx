import dynamic from "next/dynamic"

const DynamicGameOfLife = dynamic(() => import("@/app/GameOfLife"), {
	loading: () => <p>Loading...</p>,
})

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1 className="text-xl">Conway&apos;s Game of Life</h1>
			<DynamicGameOfLife />
		</main>
	)
}
