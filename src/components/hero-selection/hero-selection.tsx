import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_LIST } from './hero-list.const'
import './hero-selection.css'

enum EventKeys {
    Enter = 'Enter',
    ArrowLeft = 'ArrowLeft',
    ArrowUp = 'ArrowUp',
    ArrowRight = 'ArrowRight',
    ArrowDown = 'ArrowDown'
}

const { id: lastElementId } = HERO_LIST[HERO_LIST.length - 1];
const { id: firsElementId } = HERO_LIST[0];

export const HeroSelection = () => {
    const navigate = useNavigate();
    const [ firstPlayerHero, setFirstPlayerHero ] = useState<string>('');
    const [ secondPlayerHero, setSecondPlayerHero ] = useState<string>('');
    const [ focusedElementId, setFocusedElementId ] = useState<number>(1);

    const selectHero = (event: React.KeyboardEvent, heroName: string) => {
        if (event.key === EventKeys.Enter) {
            if (!firstPlayerHero) {
                setFirstPlayerHero(heroName);
                setFocusedElementId(5); // focus last element in first row
            } else if (!secondPlayerHero) {
                setSecondPlayerHero(heroName);
            }
        }
    }

    useEffect(() => {
        const elem = document.getElementById(String(focusedElementId));
        elem?.focus();
    }, [ focusedElementId ]);

    useEffect(() => {
        if (firstPlayerHero && secondPlayerHero) {
            setTimeout(() => {
                navigate(`/pre-fight?p1=${firstPlayerHero}&p2=${secondPlayerHero}`)
            }, 2000)
        }
    }, [firstPlayerHero, secondPlayerHero])

    // Navigation through the hero grid
    const arrowKeyEventHandler = useCallback((event: KeyboardEvent) => {
        if (!firstPlayerHero || !secondPlayerHero) {
            switch (event.key) {
                case EventKeys.ArrowRight: {
                    if (focusedElementId !== lastElementId) {
                        setFocusedElementId(focusedElementId + 1);
                    } else {
                        setFocusedElementId(firsElementId);
                    }
                    break;
                }

                case EventKeys.ArrowLeft: {
                    if (focusedElementId !== firsElementId) {
                        setFocusedElementId(focusedElementId - 1);
                    } else {
                        setFocusedElementId(lastElementId);
                    }
                    break;
                }

                case EventKeys.ArrowDown: {
                    const averageNextFocusedElementId = focusedElementId + 5; // as we know that 5 elements in row

                    if (averageNextFocusedElementId > lastElementId) {
                        const nextFocusedElementId = averageNextFocusedElementId - lastElementId;
                        setFocusedElementId(nextFocusedElementId);
                    } else {
                        setFocusedElementId(averageNextFocusedElementId);
                    }

                    break;
                }

                case EventKeys.ArrowUp: {
                    const averageNextFocusedElementId = focusedElementId - 5; // as we know that 5 elements in row

                    if (averageNextFocusedElementId < firsElementId) {
                        const nextFocusedElementId = lastElementId - (5 - focusedElementId);

                        setFocusedElementId(nextFocusedElementId);
                    } else {
                        setFocusedElementId(averageNextFocusedElementId);
                    }

                    break;
                }
            }
        }
    }, [ focusedElementId, firstPlayerHero, secondPlayerHero ]);

    useEffect(() => {
        // set listener
        document.addEventListener('keydown', arrowKeyEventHandler);

        // remove listener when component destroyed
        return () => {
            document.removeEventListener('keydown', arrowKeyEventHandler);
        }
    }, [ arrowKeyEventHandler ]);

    return (
        <div className='hero-selection'>
            <div className='hero-selection-header'>
                <div className='title'>{!firstPlayerHero ? '1st player' : '2nd player'} select your hero</div>
                <div className='sub-title'>
                    <div>1st player: <span className='hero-name'>{firstPlayerHero}</span></div>
                    <div>2nd player: <span className='hero-name'>{secondPlayerHero}</span></div>
                </div>
            </div>

            <div className='hero-grid'>
                {HERO_LIST.map((hero) => (
                    <div id={String(hero.id)} tabIndex={-1} key={hero.id}
                         onKeyDown={(e) => selectHero(e, hero.name)}
                         className={`hero ${!(firstPlayerHero && secondPlayerHero) ? firstPlayerHero ? 'p2' : 'p1' : ''}`}>
                        <img alt={hero.name} className='hero-logo' src={hero.logo}/>
                    </div>
                ))}
            </div>
        </div>
    )
}