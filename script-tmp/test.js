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
        // 1. Process catch block
        const catchClause = tryStmt.getCatchClause();
        if (catchClause) {
          const catchBlock = catchClause.getBlock();
          const catchBodyText = catchBlock.getText();
          
          if (!catchBodyText.includes('showToast')) {
            const errorVarNode = catchClause.getVariableDeclaration();
            const errorVarName = errorVarNode ? errorVarNode.getName() : 'err';
            
            catchBlock.insertStatements(0, `showToast({
        title: "Error",
        message: ${errorVarName}?.response?.data?.message || ${errorVarName}?.message || "Something went wrong",
        toastType: "error",
      });`);
            modified = true;
          }
        }

        // 2. Process try block
        const tryBlock = tryStmt.getTryBlock();
        const tryBodyText = tryBlock.getText();
        
        if (!tryBodyText.includes('showToast')) {
          const varDeclsInTry = tryBlock.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
          const resVarMatch = varDeclsInTry.find(v => !!v.getInitializer() && v.getInitializer().getKind() === SyntaxKind.AwaitExpression);
          let resName = resVarMatch ? resVarMatch.getName() : 'response';
          
          const successAssigns = tryBlock.getDescendantsOfKind(SyntaxKind.BinaryExpression)
            .filter(b => b.getLeft().getText() === 'success.value' && b.getRight().getText() === 'true');
          
          if (resVarMatch || successAssigns.length > 0) {
            const successToast = `showToast({
        title: "Success",
        message: ${resName}?.data?.message || "Operation successful",
        toastType: "success",
      });`;
            
            if (successAssigns.length > 0) {
                const exprStmt = successAssigns[0].getFirstAncestorByKind(SyntaxKind.ExpressionStatement);
                if (exprStmt) {
                    const block = exprStmt.getParent();
                    if (block && block.getKind() === SyntaxKind.Block) {
                       const index = block.getStatements().indexOf(exprStmt);
                       block.insertStatements(index + 1, successToast);
                       modified = true;
                    }
                }
            } else {
                const returnStmt = tryBlock.getStatements().find(s => s.getKind() === SyntaxKind.ReturnStatement);
                if (returnStmt) {
                  const returnChildIndex = tryBlock.getStatements().indexOf(returnStmt);
                  tryBlock.insertStatements(returnChildIndex, successToast);
                  modified = true;
                } else {
                  tryBlock.addStatements(successToast);
                  modified = true;
                }
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
    const hasImport = imports.some(i => i.getModuleSpecifierValue() === '@/composables/core/useCustomToast' || i.getModuleSpecifierValue() === '@/composables/core/useCustomToast.js');
    if (!hasImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['useCustomToast'],
        moduleSpecifier: '@/composables/core/useCustomToast'
      });
    }
    
    console.log('Modified:', path.basename(sourceFile.getFilePath()));
  }
});

project.saveSync();
