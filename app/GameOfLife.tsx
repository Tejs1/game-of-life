"use client"
import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

const GRID_SIZE = 30
const CELL_SIZE = 20

type Grid = boolean[][]

const createEmptyGrid = (): Grid =>
	Array(GRID_SIZE)
		.fill(null)
		.map(() => Array(GRID_SIZE).fill(false))

const GameOfLife: React.FC = () => {
	const [grid, setGrid] = useState<Grid>(createEmptyGrid())
	const [isRunning, setIsRunning] = useState(false)

	const countNeighbors = (grid: Grid, x: number, y: number): number => {
		let count = 0
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue
				const newX = x + i
				const newY = y + j
				if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
					count += grid[newX][newY] ? 1 : 0
				}
			}
		}
		return count
	}

	const nextGeneration = useCallback((grid: Grid): Grid => {
		const newGrid = createEmptyGrid()
		for (let i = 0; i < GRID_SIZE; i++) {
			for (let j = 0; j < GRID_SIZE; j++) {
				const neighbors = countNeighbors(grid, i, j)
				if (grid[i][j]) {
					newGrid[i][j] = neighbors === 2 || neighbors === 3
				} else {
					newGrid[i][j] = neighbors === 3
				}
			}
		}
		return newGrid
	}, [])

	useEffect(() => {
		let intervalId: NodeJS.Timeout
		if (isRunning) {
			intervalId = setInterval(() => {
				setGrid(prevGrid => nextGeneration(prevGrid))
			}, 100)
		}
		return () => clearInterval(intervalId)
	}, [isRunning, nextGeneration])

	const handleCellClick = (x: number, y: number) => {
		const newGrid = [...grid]
		newGrid[x][y] = !newGrid[x][y]
		setGrid(newGrid)
	}

	const randomizeGrid = () => {
		const newGrid = createEmptyGrid()
		for (let i = 0; i < GRID_SIZE; i++) {
			for (let j = 0; j < GRID_SIZE; j++) {
				newGrid[i][j] = Math.random() > 0.7
			}
		}
		setGrid(newGrid)
	}

	const clearGrid = () => {
		setGrid(createEmptyGrid())
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<div
				className="border border-gray-300 inline-block"
				style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
			>
				{grid.map((row, x) => (
					<div key={x} className="flex">
						{row.map((cell, y) => (
							<div
								key={`${x}-${y}`}
								className={
									`${cell ? "bg-black" : "bg-white"}` +
									" border border-gray-300"
								}
								style={{ width: CELL_SIZE, height: CELL_SIZE }}
								onClick={() => handleCellClick(x, y)}
							></div>
						))}
					</div>
				))}
			</div>
			<div className="flex gap-2">
				<Button onClick={() => setIsRunning(!isRunning)}>
					{isRunning ? "Stop" : "Start"}
				</Button>
				<Button onClick={randomizeGrid}>Randomize</Button>
				<Button onClick={clearGrid}>Clear</Button>
			</div>
		</div>
	)
}

export default GameOfLife
