import { getCustomRepository } from 'typeorm'
import { UserDetailRepository } from '../../../src/repository/repository.user.detail'

import '../database.setup'



describe('UserDetail DB TestSuite', () => {

    it('UserDetail 데이터 삽입', async () => {
        const userDetailRepository: UserDetailRepository = await getCustomRepository(UserDetailRepository)
        await userDetailRepository.insertUserDetail('이도현', '', 'Dongguk University', 'korea')
        const userDetail = await userDetailRepository.find({ profileName: '이도현' })
        expect(userDetail).toHaveLength(1)
        expect(userDetail[0].uId).toEqual(1)
        expect(userDetail[0].school).toEqual('Dongguk University')
        expect(userDetail[0].nationality).toEqual('korea')
    })
})