/**
 * Builds a prefilled GitHub issue URL for reporting mathematical errors,
 * typos, or missing theorem hypotheses on any problem, example, or formula.
 *
 * Update REPO_ISSUES_URL when publishing to a different GitHub repository.
 */
export const REPO_ISSUES_URL = 'https://github.com/OWNER/calcatlas/issues/new';

export type MathItemKind = 'problem' | 'example' | 'formula';

export interface MathErrorReportParams {
  itemId: string;
  itemLabel: string;
  kind: MathItemKind;
  context?: string;
}

export function buildMathErrorIssueUrl({
  itemId,
  itemLabel,
  kind,
  context,
}: MathErrorReportParams): string {
  const kindTitle =
    kind === 'problem'
      ? 'Mastery Problem'
      : kind === 'example'
        ? 'Worked Example'
        : 'Formula Vault Entry';

  const title = `[Math Error] ${kindTitle} (${itemId}): ${itemLabel}`;
  const bodyLines = [
    `**Item ID:** \`${itemId}\``,
    `**Category:** ${kindTitle}`,
    `**Title / Topic:** ${itemLabel}`,
    ...(context ? [`**Module / Section:** ${context}`] : []),
    '',
    '### What looks wrong?',
    '<!-- Describe the calculation error, typo, or missing hypothesis -->',
    '',
    '### Suggested correction',
    '<!-- Include derivation or reference if available -->',
  ];

  const params = new URLSearchParams({
    labels: 'math-error',
    title,
    body: bodyLines.join('\n'),
  });

  return `${REPO_ISSUES_URL}?${params.toString()}`;
}
