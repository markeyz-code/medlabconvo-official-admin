const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');

const project = new Project();
project.addSourceFilesAtPaths('/Users/mac/medlabconvo-admin-frontend/composables/modules/**/*.ts');

const sourceFiles = project.getSourceFiles();

sourceFiles.forEach(sourceFile => {
  let modified = false;

  const varDecls = sourceFile.getVariableDeclarations();
  const useHook = varDecls.find(d => d.getName() && d.getName().startsWith('use') && d.isExported());
  const funcDecls = sourceFile.getFunctions();
  const useHookFunc = funcDecls.find(d => d.getName() && d.getName().startsWith('use') && d.isExported());
  
  const hookToUse = useHook || useHookFunc;
  if (!hookToUse) return;

  let body = null;
  if (useHook) {
      const hookInit = useHook.getInitializerIfKind(SyntaxKind.ArrowFunction) || useHook.getInitializerIfKind(SyntaxKind.FunctionExpression);
      if (!hookInit) return;
      body = hookInit.getBody();
  } else {
      body = hookToUse.getBody();
  }
  
  if (!body || body.getKind() !== SyntaxKind.Block) return;

  const tryStatements = body.getDescendantsOfKind(SyntaxKind.TryStatement);
  if (tryStatements.length > 0) {
      tryStatements.forEach(tryStmt => {
        const tryBlock = tryStmt.getTryBlock();
        const tryBodyText = tryBlock.getText();
        
        if (!tryBodyText.includes('showToast')) {
          const stmts = tryBlock.getStatements();
          const awaitIndex = stmts.findIndex(s => s.getDescendantsOfKind(SyntaxKind.AwaitExpression).length > 0);
          
          if (awaitIndex !== -1) {
             const awaitStmt = stmts[awaitIndex];
             const varDecl = awaitStmt.getDescendantsOfKind(SyntaxKind.VariableDeclaration)[0];
             const resName = varDecl ? varDecl.getName() : 'response';

             const returnIndex = stmts.findIndex(s => s.getKind() === SyntaxKind.ReturnStatement);
             const endIndex = returnIndex !== -1 ? returnIndex : stmts.length;

             const movedTexts = [];
             for (let i = awaitIndex + 1; i < endIndex; i++) {
                movedTexts.push(stmts[i].getText());
             }
             
             // Remove backwards so indices don't shift
             for (let i = endIndex - 1; i > awaitIndex; i--) {
                stmts[i].remove();
             }

             if (movedTexts.length > 0 || returnIndex !== -1) {
                const toastStr = `showToast({
          title: "Success",
          message: ${resName}?.data?.message || "Operation successful",
          toastType: "success",
        });`;
                
                const ifBodyStr = [...movedTexts, toastStr].join('\n');
                
                tryBlock.insertStatements(awaitIndex + 1, `if ([200, 201, 204].includes(${resName}?.status)) {\n${ifBodyStr}\n}`);
                modified = true;
             }
          }
        }
      });
  }

  if (modified) {
    const bodyText = body.getText();
    if (!bodyText.includes('const { showToast }') && !bodyText.includes('const {showToast}')) {
      body.insertStatements(0, 'const { showToast } = useCustomToast();');
    }

    const imports = sourceFile.getImportDeclarations();
    const hasImport = imports.some(i => i.getModuleSpecifierValue() === '@/composables/core/useCustomToast');
    if (!hasImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['useCustomToast'],
        moduleSpecifier: '@/composables/core/useCustomToast'
      });
    }
  }
});

project.saveSync();
