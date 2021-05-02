
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../../../../database/repository/repository.user'
import { UserProfileRepository } from '../../../../database/repository/repository.user.profile'
import '../database.setup'

describe('UserDetail DB TestSuite', () => {

    let profileRepository: UserProfileRepository
    let repository: UserRepository

    beforeAll( async () => {
        profileRepository = getCustomRepository(UserProfileRepository)
        repository = getCustomRepository(UserRepository)
    })

    it('UserDetail 데이터 삽입', async () => {
        const newProfile = await profileRepository.insertUserProfile('master', 'https://imgur.com/ntIdiPn')
        const newUser = await repository.insertUserDetail(newProfile!, 'Dongguk Univ', 'ko')
        const allUsers = await repository.count()
        expect(allUsers).toEqual(1)
        expect(newUser !== null).toEqual(true)
        // check Profiles
        expect(newUser!.profile.profileId).toEqual(1)
        expect(newUser!.profile.profileName).toEqual('master')
        expect(newUser!.profile.profileImage).toEqual('https://imgur.com/ntIdiPn')
        // check inner values
        expect(newUser!.school).toEqual('Dongguk Univ')
        expect(newUser!.nationality).toEqual('ko')
    })

    it('UserDetail 데이터 조회 ( 정상 )', async () => {
        const user = await repository.getUserDetail(1)
        const users = await repository.find()
        expect(user !== null).toEqual(true)
        // check Profiles
        expect(user!.profile.profileId).toEqual(1)
        expect(user!.profile.profileName).toEqual('master')
        expect(user!.profile.profileImage).toEqual('https://imgur.com/ntIdiPn')
        // check inner values
        expect(user!.school).toEqual('Dongguk Univ')
        expect(user!.nationality).toEqual('ko')
    })

    it('UserDetail 데이터 조회 ( 잘못된 uId )', async () => {
        const wrongUser = await repository.getUserDetail(1000)
        expect(wrongUser === null).toEqual(true)
    })

    it('UserDetail 데이터 갱신 ( 내부 데이터 변경시 ... )', async () => {
        const oldUser = await repository.getUserDetail(1)
        const oldProfile = await profileRepository.getUserProfile(1)
        const changedProfile = await profileRepository.changeUserProfile(1, 'slave', 'https://imgur.com/ntIdiPn')
        await repository.updateInnerData(1)
        const changedUser = await repository.getUserDetail(1)
        expect(oldProfile !== changedProfile).toEqual(true)
        expect(oldUser!.updatedAt.getTime() !== changedUser!.updatedAt.getTime()).toEqual(true)
    })

    it('UserDetail 데이터 삭제 ', async () => {
        const newProfile = await profileRepository.insertUserProfile('master', 'https://imgur.com/ntl1ra')
        await repository.insertUserDetail(newProfile!, 'Seogang Univ', 'ko')
        const allUsers = await repository.count()
        expect(allUsers).toEqual(2)
        await repository.deleteUserDetail(1)
        const afterDeleteAllUsers = await repository.count()
        const afterDeleteAllProfiles = await profileRepository.count()
        expect(afterDeleteAllUsers).toEqual(1)
        expect(afterDeleteAllProfiles).toEqual(1)
        const deletedProfile = await profileRepository.getUserProfile(1)
        const deletedUser = await repository.getUserDetail(1)
        expect(deletedProfile === null).toEqual(true)
        expect(deletedUser === null).toEqual(true)
    })

})