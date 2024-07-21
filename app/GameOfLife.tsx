"use client"
import React, { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

const GRID_SIZE = 30
const CELL_SIZE = 20

type Grid = boolean[][]

const createEmptyGrid = (): Grid =>
	Array(GRID_SIZE)
		.fill(null)
		.map(() => Array(GRID_SIZE).fill(false))

const gridsEqual = (grid1: Grid, grid2: Grid): boolean => {
	for (let y = 0; y < GRID_SIZE; y++) {
		for (let x = 0; x < GRID_SIZE; x++) {
			if (grid1[y][x] !== grid2[y][x]) {
				return false
			}
		}
	}
	return true
}

const GameOfLife: React.FC = () => {
	const [grid, setGrid] = useState<Grid>(createEmptyGrid())
	const [isRunning, setIsRunning] = useState(false)
	const [isDrawing, setIsDrawing] = useState(false)
	const [lastCell, setLastCell] = useState<[number, number] | null>(null)
	const [previousStates, setPreviousStates] = useState<Grid[]>([])
	const gridRef = useRef<HTMLDivElement>(null)

	const countNeighbors = (grid: Grid, x: number, y: number): number => {
		let count = 0
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue
				const newX = x + i
				const newY = y + j
				if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
					count += grid[newY][newX] ? 1 : 0
				}
			}
		}
		return count
	}

	const nextGeneration = useCallback((grid: Grid): Grid => {
		const newGrid = createEmptyGrid()
		for (let y = 0; y < GRID_SIZE; y++) {
			for (let x = 0; x < GRID_SIZE; x++) {
				const neighbors = countNeighbors(grid, x, y)
				if (grid[y][x]) {
					newGrid[y][x] = neighbors === 2 || neighbors === 3
				} else {
					newGrid[y][x] = neighbors === 3
				}
			}
		}
		return newGrid
	}, [])
	useEffect(() => {
		let intervalId: NodeJS.Timeout
		if (isRunning) {
			intervalId = setInterval(() => {
				setGrid(prevGrid => {
					const newGrid = nextGeneration(prevGrid)

					if (
						previousStates.length > 0 &&
						(gridsEqual(newGrid, prevGrid) ||
							previousStates.some(state => gridsEqual(state, newGrid)))
					) {
						setIsRunning(false)
						return prevGrid
					}

					setPreviousStates(prev => [prevGrid, ...prev.slice(0, 1)])
					console.log(previousStates)
					return newGrid
				})
			}, 100)
		}
		return () => clearInterval(intervalId)
	}, [isRunning, nextGeneration, previousStates])

	const handleCellChange = (x: number, y: number) => {
		if (isRunning) return
		setGrid(prevGrid => {
			const newGrid = [...prevGrid]
			newGrid[y] = [...newGrid[y]]
			newGrid[y][x] = !newGrid[y][x]
			return newGrid
		})
	}

	const getGridCoordinates = (
		clientX: number,
		clientY: number,
	): [number, number] | null => {
		if (!gridRef.current) return null
		const rect = gridRef.current.getBoundingClientRect()
		const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop
		const x = Math.floor((clientX - rect.left - scrollLeft) / CELL_SIZE)
		const y = Math.floor((clientY - rect.top - scrollTop) / CELL_SIZE)
		if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
			return [x, y]
		}
		return null
	}

	const handlePointerDown = (e: React.PointerEvent) => {
		setIsDrawing(true)
		const coords = getGridCoordinates(e.clientX, e.clientY)
		if (coords) {
			handleCellChange(...coords)
			setLastCell(coords)
		}
	}

	const handlePointerMove = (e: React.PointerEvent) => {
		if (!isDrawing) return
		const coords = getGridCoordinates(e.clientX, e.clientY)
		if (
			coords &&
			(!lastCell || coords[0] !== lastCell[0] || coords[1] !== lastCell[1])
		) {
			handleCellChange(...coords)
			setLastCell(coords)
		}
	}

	const handlePointerUp = () => {
		setIsDrawing(false)
		setLastCell(null)
	}

	const randomizeGrid = () => {
		const newGrid = createEmptyGrid()
		for (let y = 0; y < GRID_SIZE; y++) {
			for (let x = 0; x < GRID_SIZE; x++) {
				newGrid[y][x] = Math.random() > 0.7
			}
		}
		setGrid(newGrid)
		setPreviousStates([])
	}

	const clearGrid = () => {
		setGrid(createEmptyGrid())
		setPreviousStates([])
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<div
				ref={gridRef}
				className="border border-gray-300 inline-block touch-none"
				style={{
					width: GRID_SIZE * CELL_SIZE,
					height: GRID_SIZE * CELL_SIZE,
					cursor: isRunning ? "not-allowed" : "pointer",
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerUp}
			>
				{grid.map((row, y) => (
					<div key={y} className="flex">
						{row.map((cell, x) => (
							<div
								key={`${y}-${x}`}
								className={`${
									cell ? "bg-black" : "bg-white"
								} border border-gray-200`}
								style={{ width: CELL_SIZE, height: CELL_SIZE }}
							/>
						))}
					</div>
				))}
			</div>
			<div className="flex gap-2">
				<Button onClick={() => setIsRunning(!isRunning)}>
					{isRunning ? "Stop" : "Start"}
				</Button>
				<Button onClick={randomizeGrid} disabled={isRunning}>
					Randomize
				</Button>
				<Button onClick={clearGrid} disabled={isRunning}>
					Clear
				</Button>
			</div>
		</div>
	)
}

export default GameOfLife
