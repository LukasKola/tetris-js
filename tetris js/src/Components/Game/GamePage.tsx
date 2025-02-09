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
    const [blockPosition, setBlockPosition] = useState({ column: 0, row: 0, width: 3, height: 1});
    const [finishedBlocks, setFinishedBlocks] = useState<{column: number, row: number}[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const dropSpeedRef = useRef(500);
    const oneGridBlockProportions = '40px'
    const gameWidth = 17;
    const gameHeight = 22;
    
    const createGameField = () => {
        const playGround: JSX.Element[][] = []
        for(let i = 0; i < gameHeight; i++){
            const row = [];           
            for(let x = 0; x < gameWidth; x++){
                const isVisibleBlock = blockPosition.column === x && blockPosition.row === i;
                const isPartOfBlock = blockPosition.width > 1 ? ((isInNumberRange(blockPosition.column, blockPosition.column + blockPosition.width, x) && blockPosition.row === i)) : false
                const isFinishedBlock = finishedBlocks.find(block => block.column === x && block.row === i);
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
            dropSpeedRef.current = 500;
        }
    }

    const handleArrowKeyDown = (e: KeyboardEvent) => {
        console.log(e)
        if(e.code === 'ArrowLeft'){
            setBlockPosition(prev => ({...prev, column: prev.column ? prev.column - 1 : 0}));
        }
        if(e.code === 'ArrowRight'){
            setBlockPosition(prev => ({ ...prev, column: prev.column === gameWidth - 1 ? prev.column : prev.column + 1 }));
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

    const dropNewBlock = () => {
        if(blockPosition.row === 0){
            setGameOver(true);
            return;
        }
        dropSpeedRef.current = 500;
        setFinishedBlocks(prev => {
            prev.push({ row: blockPosition.row, column: blockPosition.column});
            if(blockPosition.width){
                const isStillBlock = blockPosition.column + blockPosition.width;
                for(let blockPart = blockPosition.column; blockPart < isStillBlock; blockPart++){
                    prev.push({ row: blockPosition.row, column: blockPart});
                }
            }
            return prev;
        });
    }

    useEffect(() => {
        if(!gaming){
            return;
        }

        const blockMovingInterval = setInterval(() => {
            setBlockPosition(prev => {    
                if(prev.row === gameHeight - 1 || finishedBlocks.find(b => b.row === prev.row + 1 && isInNumberRange(prev.column, prev.column + prev.width, b.column))){
                    dropNewBlock();
                    return { column: 0, row: 0, height: 1, width: Math.ceil((Math.random() * 4))}
                } else {
                    return {...prev, row: prev.row + 1};
                }
            });
        }, dropSpeedRef.current);

        return () =>  clearInterval(blockMovingInterval);
    });

    const startNewGame = () => {
        setFinishedBlocks([]);
        setBlockPosition({ column: 0, row: 0, height: 0, width: Math.ceil((Math.random() * 4))});
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