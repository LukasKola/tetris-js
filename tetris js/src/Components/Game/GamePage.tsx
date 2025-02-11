import { FC, JSX, useEffect, useRef, useState } from "react";

const blockShapes = [
    [{column: 0, row: 0}, {column: 1, row: 0}, {column: 1, row: 1}, {column: 2, row: 1}],
    [{column: 0, row: 0}, {column: 1, row: 0}],
    [{column: 0, row: 0}, {column: 0, row: 1}, {column: 0, row: 2}, {column: 0, row: 3}],
    [{column: 0, row: 0}, {column: 0, row: 1}, {column: 0, row: 2}, {column: 0, row: 3},{column: 1, row: 3},{column: 2, row: 3},{column: 3, row: 3}]
];

const getRandomShape = () => {
    return blockShapes[Math.ceil(Math.random() * 3)];
}

const GamePage: FC<{ onReturnClick: () => void}> = ({ onReturnClick}) => { 
    const [gaming, setGaming] = useState(false);
    const [blockPosition, setBlockPosition] = useState<{movingBlock: { column: number; row: number}[]; finishedBlocks:  { column: number; row: number}[]}>({movingBlock: getRandomShape(), finishedBlocks: []});
    const [gameOver, setGameOver] = useState(false);
    const dropSpeedRef = useRef(300);
    const oneGridBlockProportions = '40px'
    const gameWidth: number = 17;
    const gameHeight = 22;
    const rowToRemove = useRef<number>(null);

    const createGameField = () => {
        const playGround: JSX.Element[][] = [];
        for(let i = 0; i < gameHeight; i++){
            const row = [];
            let blocksInRow = 0           
            for(let x = 0; x < gameWidth; x++){
                const isVisibleBlock = blockPosition.movingBlock.find(b => b.column === x && b.row === i);
                const isFinishedBlock = blockPosition.finishedBlocks.find(block => block.column === x && block.row === i);
                if(isFinishedBlock || isFinishedBlock){
                    blocksInRow++
                }
                const block = <div key={`${x} && ${i}`} style={{ width: oneGridBlockProportions, height: oneGridBlockProportions, border: '1px solid', backgroundColor: isVisibleBlock || isFinishedBlock ? 'black' : 'transparent' }}>{i}-{x}</div>
                row.push(block);
            }
            playGround.push([<div key={`${i}`} style={{ display: 'flex'}}>{row}</div>]);
            if(blocksInRow === gameWidth){
                rowToRemove.current = i;
            }
            blocksInRow = 0;
        }
        return playGround;
    }

    const hanldeKeyUp = (e: KeyboardEvent) => {
        if(e.code === 'Space'){
            e.preventDefault();
            dropSpeedRef.current = 100;
        }
    }

    const handleArrowKeyDown = (e: KeyboardEvent) => {
        if(e.code === 'ArrowLeft'){
            setBlockPosition(prev => {
                const prevPosition = prev.movingBlock;
                const movedPosition = prevPosition.map(pos => ({...pos, column: pos.column  - 1}));
                return {...prev, movingBlock: movedPosition};
            });
        }
        if(e.code === 'ArrowRight'){
            setBlockPosition(prev => {
                const prevPosition  = prev.movingBlock;
                const movedPosition = prevPosition.map(pos => ({...pos, column: pos.column + 1}));
                return {...prev, movingBlock: movedPosition};
            })
        }
        if(e.code === 'Space'){
            e.preventDefault();
            dropSpeedRef.current = dropSpeedRef.current > 50 ? dropSpeedRef.current - 50 : 50;
        }
    };

    useEffect(() => {
        const body = document.getElementsByTagName('body');
        body[0].addEventListener('keydown', handleArrowKeyDown);
        body[0].addEventListener('keyup',hanldeKeyUp)
        return () => {
            body[0].removeEventListener('keyup',hanldeKeyUp)
            body[0].removeEventListener('keydown',handleArrowKeyDown);
        }
    })

    useEffect(() => {
        if(!gaming){
            return;
        }

        const blockMovingInterval = setInterval(() => {
         
            setBlockPosition(prev => {
                if(prev.movingBlock.some(pos => pos.row === gameHeight - 1) || prev.finishedBlocks.find(pos =>  prev.movingBlock.some(p => pos.row === p.row + 1 && p.column === pos.column))){
                    const finishedBlocks = [...prev.finishedBlocks];
                    finishedBlocks.push(...prev.movingBlock);
                    return { movingBlock: getRandomShape(), finishedBlocks};
                } else {
                    const movingBlockPosititon = prev.movingBlock.map(pos => ({...pos, row: pos.row + 1}));
                    return { ...prev, movingBlock: movingBlockPosititon};
                }
            })
            if(rowToRemove.current){
                const removedRow: number = rowToRemove.current;
                setBlockPosition(prev => {
                    const finishedWithRemovedRow = [...prev.finishedBlocks].filter(b => b.row !== removedRow).map(b => b.row < removedRow! ? {...b, row: b.row + 1} : b);
                    return { ...prev, finishedBlocks: finishedWithRemovedRow};
                });
                rowToRemove.current = null;
            }
        }, dropSpeedRef.current);

        return () =>  clearInterval(blockMovingInterval);
    });

    const startNewGame = () => {
        setBlockPosition({movingBlock: [{ column: 0, row: 0}], finishedBlocks: []});
        setGameOver(false);
    }

    const onPauseGameClick = () => {
        if(gameOver){
            startNewGame();
            return;
        }
        if(gaming){
            setGaming(false)
        } else {
            setGaming(true)
        }
    };

    return (    
        <div>
            <button  style={{ marginBottom: '20px'}} onClick={onReturnClick}>Return to main page</button>
            {gaming ? <button onClick={onPauseGameClick} >{gameOver ? 'Start new game' : 'PAUSE'}</button> : <button onClick={onPauseGameClick} >{gameOver ? 'Start new game' : 'Return to game'}</button>}
            {gameOver ? <div>GAME OVER</div> : 
                <div style={{ height: '90vh'}} >
                    <div style={{ display: "grid"}} >
                        {createGameField()}
                    </div>  
            </div>
            }
        </div>
    );
};

export default GamePage;