# Test report v0.34

Local verification passed:

- Java typecheck against Android stubs,
- bridge Playwright tests,
- login race regression,
- 10 tune-state regression scenarios,
- all inherited v0.18–v0.29 switch/UI/EPG/logo/runtime-trace tests,
- Windows nested-asset packaging contract and 155-logo verification contract,
- new v0.34 source contract proving the v0.29 full `pageState()`/activation diagnostics remain present,
- new adult-PIN Playwright test proving the official modal accepts the configured four-digit PIN flow,
- `node --check app/src/main/assets/orange_bridge.js`.

Physical DIW377 playback/login validation is still required; local tests do not claim physical playback success.
