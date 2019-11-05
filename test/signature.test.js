import test from "ava"
import {ERROR_MESSAGE_SIGNATURE_NO_HASH as NO_HASH} from "../src/constants";
import {setUpPolly, getNewWeb3DataInstance} from "./utils";

/**********************************
 * -------- Tests Setup ---------- *
 **********************************/
test.before(t => {
    t.context.polly = setUpPolly('signature')
})

test.after(async t => {
    await t.context.polly.stop()
})

test.beforeEach(t => {
    t.context.web3data = getNewWeb3DataInstance()
})

/**
 * Test that method is called and returns successfully, i.e. a status of 200
 * @param t the test object
 * @param method
 * @param params
 * @return {Promise<void>}
 */
let statusSuccess = async (t, { method, params = {} }) => {
    const [signatureDetails] = await t.context.web3data.signature[method]('0xe2f0a05a')
    t.true(signatureDetails.hasProp('textSignature'))
}
statusSuccess.title = (providedTitle = '', input) =>  `Successfully calls ${input.method} and returns status of 200`

/**
 * Test that method rejects the promise the proper params are not provided
 * @param t the test object
 * @param endpoint
 * @param method
 * @param params
 * @param errorMessage
 */
let rejectsPromise = async (t, { method, params = {} }, errorMessage) => {

    await t.throwsAsync(async () => {
        await t.context.web3data.signature[method]()
    }, { instanceOf: Error, message: errorMessage })
}
rejectsPromise.title = (providedTitle = '', input) => `throws exception when calling ${input} without hash`

test([statusSuccess, rejectsPromise], {method: 'getSignature'}, NO_HASH)
