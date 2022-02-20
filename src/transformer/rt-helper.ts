import ts from 'typescript';
import { forwardRef } from './forward-ref';
import { literalNode } from './literal-node';
import { serialize } from './serialize';


export function rtStore(typeMap : Map<number,ts.Expression>) {
  const factory = ts.factory;

  let typeEntries = Array.from(typeMap.entries()).map(([i, t]) => factory.createPropertyAssignment(
    factory.createComputedPropertyName(ts.factory.createNumericLiteral(i)), 
    t
  ));
  let typeStore = factory.createObjectLiteralExpression(typeEntries);

  // -----------------------

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(
        factory.createIdentifier("__RΦ"),
        undefined,
        undefined,
        serialize({
          m: literalNode(factory.createArrowFunction(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("k"),
                undefined,
                undefined,
                undefined
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("v"),
                undefined,
                undefined,
                undefined
              )
            ],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createArrowFunction(
              undefined,
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier("t"),
                  undefined,
                  undefined,
                  undefined
                ),
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  factory.createToken(ts.SyntaxKind.DotDotDotToken),
                  factory.createIdentifier("a"),
                  undefined,
                  undefined,
                  undefined
                )
              ],
              undefined,
              factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
              factory.createConditionalExpression(
                factory.createBinaryExpression(
                  factory.createIdentifier("t"),
                  factory.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier("Reflect"),
                    factory.createIdentifier("metadata")
                  )
                ),
                factory.createToken(ts.SyntaxKind.QuestionToken),
                factory.createCallExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier("Reflect"),
                      factory.createIdentifier("metadata")
                    ),
                    undefined,
                    [
                      factory.createIdentifier("k"),
                      factory.createIdentifier("v")
                    ]
                  ),
                  undefined,
                  [
                    factory.createIdentifier("t"),
                    factory.createSpreadElement(factory.createIdentifier("a"))
                  ]
                ),
                factory.createToken(ts.SyntaxKind.ColonToken),
                factory.createVoidExpression(factory.createNumericLiteral("0"))
              )
            )
          )),
          f: literalNode(factory.createArrowFunction(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("f"),
                undefined,
                undefined,
                undefined
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("d"),
                undefined,
                undefined,
                undefined
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("n"),
                undefined,
                undefined,
                undefined
              )
            ],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createParenthesizedExpression(factory.createBinaryExpression(
              factory.createBinaryExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier("d"),
                    factory.createIdentifier("forEach")
                  ),
                  undefined,
                  [factory.createArrowFunction(
                    undefined,
                    undefined,
                    [factory.createParameterDeclaration(
                      undefined,
                      undefined,
                      undefined,
                      factory.createIdentifier("d"),
                      undefined,
                      undefined,
                      undefined
                    )],
                    undefined,
                    factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                    factory.createCallExpression(
                      factory.createIdentifier("d"),
                      undefined,
                      [factory.createIdentifier("f")]
                    )
                  )]
                ),
                factory.createToken(ts.SyntaxKind.CommaToken),
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier("Object"),
                    factory.createIdentifier("defineProperty")
                  ),
                  undefined,
                  [
                    factory.createIdentifier("f"),
                    factory.createStringLiteral("name"),
                    factory.createObjectLiteralExpression(
                      [
                        factory.createPropertyAssignment(
                          factory.createIdentifier("value"),
                          factory.createIdentifier("n")
                        ),
                        factory.createPropertyAssignment(
                          factory.createIdentifier("writable"),
                          factory.createFalse()
                        )
                      ],
                      false
                    )
                  ]
                )
              ),
              factory.createToken(ts.SyntaxKind.CommaToken),
              factory.createIdentifier("f")
            ))
          )),
          r: literalNode(factory.createArrowFunction(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("o"),
                undefined,
                undefined,
                undefined
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("a"),
                undefined,
                undefined,
                undefined
              )
            ],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createParenthesizedExpression(factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier("Object"),
                factory.createIdentifier("assign")
              ),
              undefined,
              [
                factory.createIdentifier("o"),
                factory.createIdentifier("a")
              ]
            ))
          )),
          a: literalNode(factory.createArrowFunction(
            undefined,
            undefined,
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("id"),
              undefined,
              undefined,
              undefined
            )],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createBlock(
              [
                factory.createVariableStatement(
                  undefined,
                  factory.createVariableDeclarationList(
                    [factory.createVariableDeclaration(
                      factory.createIdentifier("t"),
                      undefined,
                      undefined,
                      factory.createElementAccessExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier("__RΦ"),
                          factory.createIdentifier("t")
                        ),
                        factory.createIdentifier("id")
                      )
                    )],
                    ts.NodeFlags.Let
                  )
                ),
                factory.createIfStatement(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier("t"),
                    factory.createIdentifier("RΦ")
                  ),
                  factory.createBlock(
                    [
                      factory.createVariableStatement(
                        undefined,
                        factory.createVariableDeclarationList(
                          [factory.createVariableDeclaration(
                            factory.createIdentifier("r"),
                            undefined,
                            undefined,
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier("t"),
                              factory.createIdentifier("RΦ")
                            )
                          )],
                          ts.NodeFlags.Let
                        )
                      ),
                      factory.createExpressionStatement(factory.createDeleteExpression(factory.createPropertyAccessExpression(
                        factory.createIdentifier("t"),
                        factory.createIdentifier("RΦ")
                      ))),
                      factory.createExpressionStatement(factory.createCallExpression(
                        factory.createPropertyAccessExpression(
                          factory.createIdentifier("__RΦ"),
                          factory.createIdentifier("r")
                        ),
                        undefined,
                        [
                          factory.createIdentifier("t"),
                          factory.createCallExpression(
                            factory.createIdentifier("r"),
                            undefined,
                            [factory.createIdentifier("t")]
                          )
                        ]
                      ))
                    ],
                    true
                  ),
                  factory.createIfStatement(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier("t"),
                      factory.createIdentifier("LΦ")
                    ),
                    factory.createBlock(
                      [
                        factory.createVariableStatement(
                          undefined,
                          factory.createVariableDeclarationList(
                            [factory.createVariableDeclaration(
                              factory.createIdentifier("l"),
                              undefined,
                              undefined,
                              factory.createCallExpression(
                                factory.createPropertyAccessExpression(
                                  factory.createIdentifier("t"),
                                  factory.createIdentifier("LΦ")
                                ),
                                undefined,
                                []
                              )
                            )],
                            ts.NodeFlags.Let
                          )
                        ),
                        factory.createExpressionStatement(factory.createDeleteExpression(factory.createPropertyAccessExpression(
                          factory.createIdentifier("t"),
                          factory.createIdentifier("LΦ")
                        ))),
                        factory.createExpressionStatement(factory.createBinaryExpression(
                          factory.createElementAccessExpression(
                            factory.createPropertyAccessExpression(
                              factory.createIdentifier("__RΦ"),
                              factory.createIdentifier("t")
                            ),
                            factory.createIdentifier("id")
                          ),
                          factory.createToken(ts.SyntaxKind.EqualsToken),
                          factory.createBinaryExpression(
                            factory.createIdentifier("t"),
                            factory.createToken(ts.SyntaxKind.EqualsToken),
                            factory.createIdentifier("l")
                          )
                        ))
                      ],
                      true
                    ),
                    undefined
                  )
                ),
                factory.createReturnStatement(factory.createIdentifier("t"))
              ],
              true
            )
          )),
          t: literalNode(typeStore)
        })
      )],
      ts.NodeFlags.Const
    )
  )
}