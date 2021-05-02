import { SmsService } from "../../../app/services/service.sms"

describe('SmsService TestSuite', () => {
    
    let service: SmsService

    beforeAll(()=> {
        service = new SmsService()
    })

    it('Code Generator 케이스 테스트', () => {
        const testCount = 1000*100
        let hitCount = 0
        let codeSet = new Set<string>()
        let code = ''
        for (let i=0; i< testCount; i++) {
            code = service.generatePassword()
            codeSet.add(code)
            if (code.length == 4) hitCount += 1
        }
        expect(hitCount == testCount).toEqual(true)
        expect(codeSet.size > 9000).toEqual(true)
    })
})