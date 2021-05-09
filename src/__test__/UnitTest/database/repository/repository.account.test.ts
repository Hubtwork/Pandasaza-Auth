
import { getCustomRepository } from 'typeorm'
import { AccountRepository } from '../../../../database/repository/repository.account'
import { UserRepository } from '../../../../database/repository/repository.user'
import { UserProfileRepository } from '../../../../database/repository/repository.user.profile'
import UserDTO from '../../../../interfaces/interface.DTO.user'
import '../../../database.setup'

describe('Account DB TestSuite', () => {

    let profileRepository: UserProfileRepository
    let userRepository: UserRepository
    let repository: AccountRepository

    const user1: UserDTO = {
        phone: '010xxxxyyyy',
        profileName: 'master',
        profileImg: 'https://imgur.com/d5G3whb',
        school: 'Dongguk Univ',
        nationality: 'ko'
    }

    const user2: UserDTO = {
        phone: '010yyyyzzzz',
        profileName: 'slave',
        profileImg: 'https://imgur.com/d5G3whb',
        school: 'Seogang Univ',
        nationality: 'ko'
    }

    beforeAll( async () => {
        profileRepository = getCustomRepository(UserProfileRepository)
        userRepository = getCustomRepository(UserRepository)
        repository = getCustomRepository(AccountRepository)
    })

    it('신규 계정 생성', async () => {
        
        await repository.insertAccount(user1)

        await repository.insertAccount(user2)

        const allAccounts = await repository.find({ order: { registeredAt: 'DESC' }})
        const allUser = await userRepository.find()
        const allProfile = await profileRepository.find()
        expect(allProfile.length).toEqual(2)
        expect(allUser.length).toEqual(2)
        expect(allAccounts.length).toEqual(2)
        expect(allAccounts[0].phone === '010yyyyzzzz').toEqual(true)
        expect(allAccounts[1].phone === '010xxxxyyyy').toEqual(true)
    })

    it('계정 정보 검색 ( 정상 )', async () => {
        const account = await repository.getAccountByPhone('010xxxxyyyy')
        // account check
        expect(account !== null).toEqual(true)
        expect(account!.phone).toEqual('010xxxxyyyy')
        // user relation check
        expect(account!.user!.uId).toEqual(1)
        expect(account!.user!.school).toEqual('Dongguk Univ')
        expect(account!.user!.profile !== null).toEqual(true)
        // profile relation check
        expect(account!.user.profile.profileId).toEqual(1)
        expect(account!.user.profile.profileName).toEqual('master')
    })

    it('계정 정보 검색 ( 미등록 번호 )', async () => {
        const account = await repository.getAccountByPhone('010zzzzssss')
        expect(account === null).toEqual(true)
    })

    it('계정 삭제', async () => {
        const target = '010xxxxyyyy'
        await repository.deleteAccount(target)
        const allAccounts = await repository.find()
        const allUser = await userRepository.find()
        const allProfile = await profileRepository.find()
        expect(allProfile.length).toEqual(1)
        expect(allUser.length).toEqual(1)
        expect(allAccounts.length).toEqual(1)
        // No Accounts find check
        const account = await repository.getAccountByPhone(target)
        expect(account === null).toEqual(true)
    })

})