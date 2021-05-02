import { getCustomRepository } from 'typeorm'
import { UserProfileRepository } from '../../../../database/repository/repository.user.profile'

import '../database.setup'

// all covered
describe('UserProfile DB TestSuite', () => {
    
    let repository: UserProfileRepository

    beforeAll( async () => { 
        repository = getCustomRepository(UserProfileRepository) 
    })

    it('신규 유저 프로필 생성', async () => {
        await repository.insertUserProfile('master', 'https://imgur.com/d5G3whb')
        await repository.insertUserProfile('slave', 'https://imgur.com/ntIdiPn')
        await repository.insertUserProfile('master', 'https://imgur.com/k7smud6')
        const userDetail = await repository.find({ profileName: 'master' })
        const allProfileCount = await repository.count()
        expect(allProfileCount).toEqual(3)
        expect(userDetail).toHaveLength(2)
        expect(userDetail[0].profileId).toEqual(1)
        expect(userDetail[0].profileName).toEqual('master')
        expect(userDetail[0].profileImage).toEqual('https://imgur.com/d5G3whb')
    })

    it('유저 프로필 조회 ( 정상 )', async () => {
        const correctProfile = await repository.getUserProfile(2)
        expect(correctProfile !== null).toEqual(true)
        expect(correctProfile!.profileName).toEqual('slave')
        expect(correctProfile!.profileImage.length > 0).toEqual(true)
    })

    it('유저 프로필 조회 ( 잘못된 profileId )', async () => {
        const wrongProfile = await repository.getUserProfile(100000)
        expect(wrongProfile === null).toEqual(true)
    })

    it('유저 프로필 변경', async () => {
        const target: number = 3
        const changedProfile = await repository.changeUserProfile(target, 'friend', 'https://imgur.com/d5G3whb')
        expect(changedProfile !== null).toEqual(true)
        expect(changedProfile!.profileId).toEqual(3)
        expect(changedProfile!.profileName).toEqual('friend')
        // force not same with before
        expect(changedProfile!.profileImage !== 'https://imgur.com/k7smud6').toEqual(true)
        expect(changedProfile!.profileImage).toEqual('https://imgur.com/d5G3whb')
    })

    it('유저 프로필 변경 ( 잘못된 profileId )', async () => {
        const wrongProfile = await repository.getUserProfile(-1)
        expect(wrongProfile === null).toEqual(true)
    })

    it('유저 프로필 삭제', async() => {
        const deletedProfileId = await repository.deleteUserProfile(2)  
        const searchProfile = await repository.getUserProfile(2)
        const allProfileCount = await repository.count()
        expect(deletedProfileId !== null).toEqual(true)
        expect(allProfileCount).toEqual(2)
        expect(searchProfile === null).toEqual(true)
    })

    it('유저 프로필 삭제 ( 잘못된 profileId )', async() => { 
        const wrongDeleteProfileId = await repository.deleteUserProfile(2)
        expect(wrongDeleteProfileId === null).toEqual(true)
    })
})