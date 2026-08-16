# TEST REPORT v0.36

Local verification passed:

- Java type-check against Android API stubs;
- login race Playwright regression: disabled submit -> Orange shell -> 3 real channel cards -> AUTH;
- v0.36 strict-auth Playwright test: shell is not AUTH, 3 channel cards are AUTH, login form remains FORM;
- v0.17 tune state model (10 scenarios);
- v0.23/v0.24 switch/local-logo/Windows asset packaging regressions;
- v0.25 identity/EPG regressions;
- v0.26 runtime-log regressions;
- v0.27 exact-X close/identity regressions;
- v0.28 switch recovery/immutable diagnostics;
- v0.29 bounded activation diagnostics;
- v0.35 one-time enrollment/auto-login/adult-PIN regression;
- v0.20-v0.22 UI/EPG/metadata sweep regressions;
- sanitized runtime trace contract;
- bridge Playwright activation/media contract.

No physical DIW377 claim is made until the build is tested on the decoder.
