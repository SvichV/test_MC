import {useState} from 'react';
import {HERO_LIST} from './hero-list.const'

export const HeroSelection = () => {
    const [firstPlayerHero, setFirstPlayerHero] = useState<string>('')
    const [secondPlayerHero, setSecondPlayerHero] = useState<string>('')

    const selectHero = (heroName: string) => {
        if (!firstPlayerHero) {
            setFirstPlayerHero(heroName)
        } else if (!secondPlayerHero) {
            setSecondPlayerHero(heroName)
        }
    }

    return (
        <div>
            <div className='title'>{!firstPlayerHero ? '1st player' : '2nd player'} select your hero</div>
            <div className='sub-title'>
                <div>1st player: {firstPlayerHero}</div>
                <div>2nd player: {secondPlayerHero}</div>
            </div>

            <div className='hero-grid'></div>
        </div>
    )
}