

import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../../../src/repository/repository.user'
import { UserProfileRepository } from '../../../src/repository/repository.user.profile'
import { AccountRepository } from '../../../src/repository/repository.account'
import '../database.setup'

describe('Account DB TestSuite', () => {

    let profileRepository: UserProfileRepository
    let userRepository: UserRepository
    let repository: AccountRepository

    beforeAll( async () => {
        profileRepository = getCustomRepository(UserProfileRepository)
        userRepository = getCustomRepository(UserRepository)
        repository = getCustomRepository(AccountRepository)
    })

    it('신규 계정 생성', async () => {
        const profile1 = await profileRepository.insertUserProfile('master', 'https://imgur.com/d5G3whb')
        const user1 = await userRepository.insertUserDetail(profile1!, 'Dongguk Univ', 'ko')
        await repository.insertAccount('01075187260', user1!)

        const profile2 = await profileRepository.insertUserProfile('slave', 'https://imgur.com/d5G3whb')
        const user2 = await userRepository.insertUserDetail(profile2!, 'Seogang Univ', 'ko')
        await repository.insertAccount('01058826974', user2!)

        const allAccounts = await repository.find({ order: { registeredAt: 'DESC' }})
        const allUser = await userRepository.find()
        const allProfile = await profileRepository.find()
        expect(allProfile.length).toEqual(2)
        expect(allUser.length).toEqual(2)
        expect(allAccounts.length).toEqual(2)
        expect(allAccounts[0].phone === '01058826974').toEqual(true)
        expect(allAccounts[1].phone === '01075187260').toEqual(true)
    })

    it('계정 정보 검색 ( 정상 )', async () => {
        const account = await repository.findAccount('01075187260')
        // account check
        expect(account !== null).toEqual(true)
        expect(account!.phone).toEqual('01075187260')
        // user relation check
        expect(account!.user!.uId).toEqual(1)
        expect(account!.user!.school).toEqual('Dongguk Univ')
        expect(account!.user!.profile !== null).toEqual(true)
        // profile relation check
        expect(account!.user.profile.profileId).toEqual(1)
        expect(account!.user.profile.profileName).toEqual('master')
    })

    it('계정 정보 검색 ( 미등록 번호 )', async () => {
        const account = await repository.findAccount('01044442312')
        expect(account === null).toEqual(true)
    })

    it('계정 삭제', async () => {
        const target = '01075187260'
        await repository.deleteAccount(target)
        const allAccounts = await repository.find()
        const allUser = await userRepository.find()
        const allProfile = await profileRepository.find()
        expect(allProfile.length).toEqual(1)
        expect(allUser.length).toEqual(1)
        expect(allAccounts.length).toEqual(1)
        // No Accounts find check
        const account = await repository.findAccount(target)
        expect(account === null).toEqual(true)
    })

})