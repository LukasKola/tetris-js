import { FC, JSX, useEffect, useRef, useState } from "react";

const isInNumberRange = (rangeStart: number, rangeEnd: number, number: number) => {
    for(let curr = rangeStart; curr < rangeEnd; curr++){
        if(number === curr){
            return true;
        }
    }
    return false;
}

const GamePage: FC<{ onReturnClick: () => void}> = ({ onReturnClick}) => { 
    const [gaming, setGaming] = useState(false);
    const [blockPosition, setBlockPosition] = useState<{movingBlock: { column: number; row: number; width: number; height: number}; finishedBlocks:  { column: number; row: number}[]}>({movingBlock: { column: 0, row: 0, width: Math.ceil((Math.random() * 4)), height: 1}, finishedBlocks: []});
    const [gameOver, setGameOver] = useState(false);
    const dropSpeedRef = useRef(200);
    const oneGridBlockProportions = '40px'
    const gameWidth: number = 17;
    const gameHeight = 22;
    const rowToRemove = useRef<number>(null);

    const createGameField = () => {
        const playGround: JSX.Element[][] = []
        for(let i = 0; i < gameHeight; i++){
            const row = [];           
            for(let x = 0; x < gameWidth; x++){
                const isVisibleBlock = blockPosition.movingBlock.column === x && blockPosition.movingBlock.row === i;
                const isPartOfBlock = blockPosition.movingBlock.width > 1 ? ((isInNumberRange(blockPosition.movingBlock.column, blockPosition.movingBlock.column + blockPosition.movingBlock.width, x) && blockPosition.movingBlock.row === i)) : false
                const isFinishedBlock = blockPosition.finishedBlocks.find(block => block.column === x && block.row === i);
                const block = <div key={`${x} && ${i}`} style={{ width: oneGridBlockProportions, height: oneGridBlockProportions, border: '1px solid', backgroundColor: isVisibleBlock || isFinishedBlock || isPartOfBlock ? 'black' : 'transparent' }}>{i}-{x}</div>
                row.push(block);
            }
            playGround.push([<div key={`${i}`} style={{ display: 'flex'}}>{row}</div>]);
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
            setBlockPosition(prev => ({...prev, movingBlock: {...prev.movingBlock, column: prev.movingBlock.column ? prev.movingBlock.column - 1 : 0}}));
        }
        if(e.code === 'ArrowRight'){
            setBlockPosition(prev => ({ ...prev, movingBlock: {...prev.movingBlock, column: prev.movingBlock.column === gameWidth - 1 ? prev.movingBlock.column : prev.movingBlock.column + 1} }));
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
                if(prev.movingBlock.row === gameHeight - 1 || prev.finishedBlocks.find(b => b.row === prev.movingBlock.row + 1 && isInNumberRange(prev.movingBlock.column, prev.movingBlock.column + prev.movingBlock.width, b.column))){
                    const finishedBlocks = [...prev.finishedBlocks];
                    const currentRow = prev.movingBlock.row
                    const range = prev.movingBlock.column + prev.movingBlock.width;
                    for(let blockPart = prev.movingBlock.column; blockPart < range; blockPart++){
                        finishedBlocks.push({ row: blockPosition.movingBlock.row, column: blockPart});
                    }
                    const actuallRowBlockNumber = finishedBlocks.filter(b => b.row === prev.movingBlock.row).length;

                    if(actuallRowBlockNumber === gameWidth){
                        rowToRemove.current = currentRow; 
                    }
                    return {finishedBlocks, movingBlock: {column: 0, row: 0, height: 1, width: Math.ceil((Math.random() * 4))}};
                } else {
                    return {...prev, movingBlock: {...prev.movingBlock, row: prev.movingBlock.row + 1}};
                }
            });
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
        setBlockPosition({movingBlock: { column: 0, row: 0, height: 0, width: Math.ceil((Math.random() * 4))}, finishedBlocks: []});
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