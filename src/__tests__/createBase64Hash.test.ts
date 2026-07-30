import { createBase64Hash } from '../createBase64Hash';

describe('createBase64Hash', () => {
  // 'expected' is what Ruby produces from `Digest::SHA256.base64digest(input)`
  // Minus the appended '=', which this SDK has always deliberately stripped
  // Inputs are the result of Ruby's SecureRandom.uuid_v4 to match the SDK's uuid
  const tests = [
    [
      { input: 'cb24d167-e486-4b8b-b5a6-3db4139203d9', expected: 'r+vjA2vgVoXqSnpRp+DWAih/8b69Ogv3Aq22BQO9VBk' },
      { input: '3c167cb0-d423-4db5-b3c7-6b428be888f7', expected: '41woqAux5HXSWhrk1UA+FFjjkN0OP81H3wPMrZV9qoQ' },
      { input: 'b978a9b6-d14e-4465-a41f-833580ceae1e', expected: 'ZFV/ImIxTa8uw2m4aYce8m2LUNVAHcUInO/wdY0UT9U' },
      { input: 'c1f4b085-b9df-4a6d-a88f-2fda4500534f', expected: '5pi9qmTZPPzmZdxtGb+Aa6fkemAX26wMmoAO7g4a4bA' },
      { input: 'a93edcfc-2be9-48dc-9b6d-b34e40f198c3', expected: 'Eajvhe+9co98z0P45MB3HP3kcm50/WIupwLWi9EYryY' }
    ]
  ];

  it.each(tests)('generates $expected from $input', async ({ input, expected }) => {
    expect(await createBase64Hash(input)).toEqual(expected);
  });
});
