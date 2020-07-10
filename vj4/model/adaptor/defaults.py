DEFAULT_CODE_TEMPLATES = {
  'c': r"""
/*
 author: topscoding
 p = 1000
 you can add some comments here.
*/
#include <stdio.h>

int main()
{
    printf("hello, world\n");
}
""",
  'cc': r"""
/*
 author: topscoding
 p = 1000
 you can add some comments here.
*/
#include <iostream>
using namespace std;

int main()
{
    cout << "hello, world" << endl;
    return 0;
}
""",
  'pas': r"""
begin
    writeln('hello, world');
end.
""",
  'java': r"""
import java.io.*;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        System.out.println("hello, world");
    }
}
""",
  'py': r"""
print 'hello, world'
""",
  'py3': r"""
print('hello, world')
""",
  'php': r"""
hello, world
""",
  'rs': r"""
fn main() {
  println!("hello, world!");
}
""",
  'hs': r"""
main = putStrLn "hello, world"
""",
}
