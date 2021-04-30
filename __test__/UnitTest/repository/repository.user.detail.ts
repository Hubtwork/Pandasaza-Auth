import { getCustomRepository } from 'typeorm'
import { UserProfile } from '../../../src/entities/entity.user.profile'
import { UserDetailRepository } from '../../../src/repository/repository.user'

import '../database.setup'



describe('UserDetail DB TestSuite', () => {

    it('UserDetail 데이터 삽입', async () => {
        const profile: UserProfile = new UserProfile()
        const userDetailRepository: UserDetailRepository = await getCustomRepository(UserDetailRepository)
        await userDetailRepository.insertUserDetail(profile, 'Dongguk University', 'korea')
        const userDetail = await userDetailRepository.find({ uId: 1 })
        expect(userDetail).toHaveLength(1)
        expect(userDetail[0].uId).toEqual(1)
        expect(userDetail[0].school).toEqual('Dongguk University')
        expect(userDetail[0].nationality).toEqual('korea')
    })
})