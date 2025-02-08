import { FC, JSX, use, useEffect, useState } from "react";

const GamePage: FC<{ onReturnClick: () => void}> = ({ onReturnClick}) => { 
    const [gaming, setGaming] = useState(false);
    const [blockPosition, setBlockPosition] = useState({ column: 0, row: 0, widht: 3, height: 1});
    const [finishedBlocks, setFinishedBlocks] = useState<{column: number, row: number}[]>([]);
    const [gameOver, setGameOver] = useState(false);

    const oneGridBlockProportions = '40px'

    const createGameField = () => {
        const playGround: JSX.Element[][] = []
        for(let i = 0; i < 17; i++){
            const row = [];
            for(let x = 0; x < 14;x++){
                const isVisibleBlock = blockPosition.column === x && blockPosition.row === i;
                const isFinishedBlock = finishedBlocks.find(block => block.column === x && block.row === i);
                const block = <div key={`${x} && ${i}`} style={{ width: oneGridBlockProportions, height: oneGridBlockProportions, border: '1px solid', backgroundColor: isVisibleBlock || isFinishedBlock ? 'black' : 'transparent' }}/>
                row.push(block);
            }
            playGround.push([<div key={`${i}`} style={{ display: 'flex'}}>{row}</div>]);
        }
        return playGround;
    }

    const handleArrowKeyDown = (e: KeyboardEvent) => {
        console.log(e);
        if(e.code === 'ArrowLeft'){
            setBlockPosition(prev => ({...prev, column: prev.column ? prev.column - 1 : 0}));
        }
        if(e.code === 'ArrowRight'){
            setBlockPosition(prev => ({ ...prev, column: prev.column + 1 }));
        }
    };

    useEffect(() => {
        const body = document.getElementsByTagName('body');
        body[0].addEventListener('keydown', handleArrowKeyDown);
        return () => body[0].removeEventListener('keydown',handleArrowKeyDown);
    })

    const dropNewBlock = () => {
        if(blockPosition.row === 0){
            setGameOver(true);
            return;
        }
        setFinishedBlocks(prev => {
            prev.push({ row: blockPosition.row, column: blockPosition.column});
            return prev;
        });
    }

    useEffect(() => {
        if(!gaming){
            return;
        }

        const blockMovingInterval = setInterval(() => {
            setBlockPosition(prev => {
                if(prev.row === 16 || finishedBlocks.find(b => b.row === prev.row + 1 && prev.column === b.column)){
                    dropNewBlock();
                        return { column: 0, row: 0, height: 1, widht: 1}
                } else {
                    return {...prev, row: prev.row + 1};
                }
            });
        }, 100);

        return () =>  clearInterval(blockMovingInterval);
    });

    const startNewGame = () => {
        setFinishedBlocks([]);
        setBlockPosition({ column: 0, row: 0, height: 0, widht: 0});
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