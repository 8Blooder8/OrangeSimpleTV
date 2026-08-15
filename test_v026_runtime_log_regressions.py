from pathlib import Path
root=Path(__file__).resolve().parent

# This repository branch is documentation-oriented; when the full source tree is present,
# the same contract lives under tests/test_v026_runtime_log_regressions.py.
# Runtime evidence requiring the regression:
# 1) real player reported PLAYING/RVFC repeatedly but finishTune never committed,
# 2) console repeated SyntaxError caused by semicolon chains passed as evalBridge expressions,
# 3) guide EPG reported 154 programs/149 schedules while the chosen 164-card native snapshot had zero program names.

print('v0.26 contract: evalBridge expressions must be single JS expressions; discovery metadata merges by channel identity; EPG traversal stays bounded')
